import { NextRequest, NextResponse } from 'next/server';
import { createMetadata, Metadata, ValidatedMetadata, createParameter, PARAM_TEMPLATES, ExecutionResponse } from '@sherrylinks/sdk';
import { avalanche } from 'viem/chains';
import { serializeTx } from '../../utils/serializer.util';

export async function GET(req: NextRequest) {
    try {
        // Get server URL information
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = req.headers.get('x-forwarded-proto') || 'http';

        // Build the base URL
        const serverUrl = `${protocol}://${host}`;

        // We'll build the metadata object step by step below
        const metadata: Metadata = {
            url: 'https://lfj.gg/',
            icon: 'https://www.cryptotimes.io/wp-content/uploads/2025/02/LFJ-Trading-Terminal-Launches-Limit-Orders-for-AVAX.png',
            title: 'Buy JOE with AVAX',
            baseUrl: serverUrl,
            description:
                'Pick a bag or name your price. Swap AVAX for JOE.',
            actions: [
                {
                    type: 'dynamic',
                    label: '0.1 AVAX',
                    description:
                        'Action description',
                    chains: { source: avalanche.id },
                    path: `/api/buy-joe?amount=0.1`,
                    params: [
                        createParameter(PARAM_TEMPLATES.ADDRESS, {
                            name: 'to',
                            label: 'Send JOE tokens to address',
                            value: 'sender',
                        }),
                    ],
                },
                {
                    type: 'dynamic',
                    label: '0.5 AVAX',
                    description:
                        'Action description',
                    chains: { source: avalanche.id },
                    path: `/api/buy-joe?amount=0.5`,
                    params: [
                        createParameter(PARAM_TEMPLATES.ADDRESS, {
                            name: 'to',
                            label: 'Send JOE tokens to address',
                            value: 'sender',
                        }),
                    ],
                },
                {
                    type: 'dynamic',
                    label: '1 AVAX',
                    description:
                        'Action description',
                    chains: { source: avalanche.id },
                    path: `/api/buy-joe?amount=1`,
                    params: [
                        createParameter(PARAM_TEMPLATES.ADDRESS, {
                            name: 'to',
                            label: 'Send JOE tokens to address',
                            value: 'sender',
                        }),
                    ],
                },
                {
                    type: 'dynamic',
                    label: 'Send it',
                    description:
                        'How much AVAX? You tell us.',
                    chains: { source: avalanche.id },
                    path: `/api/buy-joe`,
                    params: [
                        createParameter(PARAM_TEMPLATES.ADDRESS, {
                            name: 'to',
                            label: 'Send JOE tokens to address',
                            value: 'sender',
                        }),
                        {
                            name: 'amount',
                            label: "Custom amount",
                            type: 'number',
                            required: false,
                            description: 'Buy custom amount of JOE tokens',
                        },
                    ],
                },
            ],
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

export async function POST(req: NextRequest) {
    try {
        // Extract parameters
        const { searchParams } = new URL(req.url);
        const to = searchParams.get('to');
        const amount = searchParams.get('amount') as string;

        // Validate required parameters
        if (!to) {
            return NextResponse.json(
                { error: 'User not logged in' },
                {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                },
            );
        }

        // Serialize the transaction for the blockchain
        const serialized = await serializeTx(amount, avalanche.id, to);

        // Create the response object expected by Sherry
        const resp: ExecutionResponse = {
            serializedTransaction: serialized,
            chainId: avalanche.id,
        };

        // Return the response with CORS headers
        return NextResponse.json(resp, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            },
        });


    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 204, // No Content
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
                'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
        },
    });
}
