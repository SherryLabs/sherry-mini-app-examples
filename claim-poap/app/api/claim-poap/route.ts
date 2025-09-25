import { NextRequest, NextResponse } from "next/server";
import { Metadata, createMetadata, ValidatedMetadata, TextBasedParameter, NumberBasedParameter, DynamicAction } from "@sherrylinks/sdk";
import { createRedisClient } from "../../lib/redis";

const POAP_API_KEY = process.env.POAP_API_KEY;
const POAP_CLIENT_ID = process.env.POAP_CLIENT_ID;
const POAP_CLIENT_SECRET = process.env.POAP_CLIENT_SECRET;
const POAP_EVENT_ID = process.env.POAP_EVENT_ID;
const POAP_SECRET_CODE = process.env.POAP_SECRET_CODE;

export async function GET(req: NextRequest) {
  try {
    // Get server URL information
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';

    // Build the base URL
    const serverUrl = `${protocol}://${host}`;

    // Get POAP event details
    const eventResponse = await fetch(
      `https://api.poap.tech/events/id/${POAP_EVENT_ID}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": POAP_API_KEY!,
          "Content-Type": "application/json",
        }
      }
    );

    if (!eventResponse.ok) {
      console.error("[POAP Claim] Get event error:", await eventResponse.text());
      return NextResponse.json(
        { error: "Failed to get POAP event" },
        { status: 404 }
      );
    }

    const { image_url, name, description } = await eventResponse.json();

    // We'll build the metadata object step by step below
    const metadata: Metadata = {
      url: "https://poap.xyz/",
      icon: image_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuvyKc8bcFGsg_cFktpgiR7ni1-TbyBK7FEA&s",
      title: `Mint ${name} POAP`,
      baseUrl: serverUrl,
      description,
      actions: [
        {
          type: "dynamic",
          label: "Mint POAP",
          path: "/api/claim-poap",
          responseType: 'data',
          params: [
            {
              name: 'eventId',
              label: 'Event Id',
              type: 'number',
              required: true,
              value: POAP_EVENT_ID
            } as NumberBasedParameter,
            {
              name: 'to',
              label: 'Recipient Address',
              type: 'text',
              required: true,
              value: "sender"
            } as TextBasedParameter
          ],
          chains: { source: 1 },
        } as DynamicAction
      ]
    };

    // Validate metadata using the SDK
    const validated: ValidatedMetadata = createMetadata(metadata);

    // Return with CORS headers for cross-origin access
    return NextResponse.json(validated, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });


  } catch (error) {
    console.error('Error creating metadata:', error);
    return NextResponse.json({ error: 'Error creating metadata' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const userAddress = searchParams.get('to');

    if (!eventId || !userAddress) {
      return NextResponse.json(
        { error: "User address and EventsId are required" },
        { status: 400 }
      );
    }

    // Check if user has already claimed using Redis
    const redis = createRedisClient();
    if (redis) {
      const claimKey = `poap_claim:${eventId}:${userAddress}`;
      const existingClaim = await redis.get(claimKey);

      if (existingClaim) {
        return NextResponse.json(
          { error: "You have already claimed this POAP" },
          { status: 400 }
        );
      }
    }

    // Get POAP access token
    const authResponse = await fetch("https://auth.accounts.poap.xyz/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audience: "https://api.poap.tech",
        grant_type: "client_credentials",
        client_id: POAP_CLIENT_ID,
        client_secret: POAP_CLIENT_SECRET,
      }),
    });

    if (!authResponse.ok) {
      console.error("[POAP Claim] Auth error:", await authResponse.text());
      return NextResponse.json(
        { error: "Failed to authenticate with POAP API" },
        { status: 500 }
      );
    }

    const { access_token } = await authResponse.json();

    // Request a claim code
    const claimResponse = await fetch(
      `https://api.poap.tech/event/${eventId}/qr-codes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "X-API-Key": POAP_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret_code: POAP_SECRET_CODE,
        }),
      }
    );

    if (!claimResponse.ok) {
      console.error("[POAP Claim] Claim code error:", await claimResponse.text());
      return NextResponse.json(
        { error: "Failed to generate claim code" },
        { status: 500 }
      );
    }

    const qrCodes = await claimResponse.json() || [];

    // Find the first unclaimed QR code
    const qrCode = qrCodes.find((code: { qr_hash: string; claimed: boolean }) => !code.claimed);

    if (!qrCode) {
      return NextResponse.json(
        { error: "All claim codes have already been claimed" },
        { status: 500 }
      );
    }

    // Redeem the claim code for the user
    const redeemResponse = await fetch(
      `https://api.poap.tech/actions/claim-qr`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "X-API-Key": POAP_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: userAddress?.toLowerCase(),
          qr_hash: qrCode.qr_hash,
        }),
      }
    );

    if (!redeemResponse.ok) {
      const errorText = await redeemResponse.text();
      console.error("[POAP Claim] Redeem error:", errorText);
      return NextResponse.json(
        { error: "Failed to mint POAP" },
        { status: 500 }
      );
    }

    // Save claim to Redis
    if (redis) {
      const claimKey = `poap_claim:${eventId}:${userAddress}`;
      await redis.set(
        claimKey,
        JSON.stringify({
          userAddress,
          eventId,
          claimedAt: new Date().toISOString(),
        })
      );
    }

    return NextResponse.json({
      success: true,
      message: "POAP claimed successfully",
    });

  } catch (error) {
    console.error("[POAP Claim] Error:", error);
    return NextResponse.json(
      { error: "Failed to claim POAP" },
      { status: 500 }
    );
  }
}