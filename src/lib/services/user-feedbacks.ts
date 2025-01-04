import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { UserFeedback } from '../types/user-feedback';

const fetcher = async (url: string, session: any) => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user?.accessToken}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        console.error('Failed to fetch:', error);
        throw new Error(error.message || 'Failed to fetch data');
    }

    return res.json();
};

export function useUserFeedback() {
    const { data: session } = useSession();

    const { data, error, mutate, isValidating } = useSWR<UserFeedback[]>(
        session?.user ? `/api/agencies` : null,
        (url) => fetcher(url, session),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            shouldRetryOnError: false,
        }
    );

    // const createUserFeedback = async (feedbackData: Partial<UserFeedback>) => {
    //     if (!session?.user?.accessToken) {
    //         throw new Error('Unauthorized');
    //     }

    //     const res = await fetch('/api/user-feedbacks', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${session.user.accessToken}`,
    //         },
    //         body: JSON.stringify(feedbackData),
    //     });

    //     if (!res.ok) {
    //         const error = await res.json();
    //         console.error('Failed to create user feedback:', error);
    //         throw new Error(error.message || 'Failed to create user feedback');
    //     }

    //     const newFeedback = await res.json();

    //     mutate();

    //     return newFeedback;
    // };




    // return {
    //     feedbacks: data || [],
    //     error,
    //     mutate,
    //     isLoading: isValidating,
    //     createUserFeedback
    // };
}
