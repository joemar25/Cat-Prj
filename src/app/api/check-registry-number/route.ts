import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { registryNumber, formType } = await req.json();

    // Validate input
    if (!registryNumber || !formType) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
      });
    }

    // Check if the registry number exists in the database
    const existingRegistry = await prisma.baseRegistryForm.findFirst({
      where: { registryNumber, formType },
    });

    return new Response(JSON.stringify({ exists: !!existingRegistry }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error checking registry number:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check registry number' }),
      { status: 500 }
    );
  }
}
