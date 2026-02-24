import { getLessonsForInstructor, initializeLessonsFromContent } from '@/data/lessons';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instructor = searchParams.get('instructor');

  if (!instructor) {
    return Response.json({ error: 'Missing instructor parameter' }, { status: 400 });
  }

  try {
    // Ensure lessons are initialized
    await initializeLessonsFromContent();
    
    const lessons = getLessonsForInstructor(instructor);
    // Log lesson counts and environment diagnostics for troubleshooting in production
    try {
      const counts = {
        beginner: lessons?.beginner?.length ?? 0,
        intermediate: lessons?.intermediate?.length ?? 0,
        advanced: lessons?.advanced?.length ?? 0
      };
      console.log('/api/lessons GET', { instructor, counts, NEXT_PUBLIC_FINAL_CODE: process.env.NEXT_PUBLIC_FINAL_CODE });
    } catch (e) {
      console.warn('Failed to log lessons diagnostics:', e);
    }
    
    if (!lessons) {
      return Response.json({ error: 'Instructor not found' }, { status: 404 });
    }

    return Response.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return Response.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
