import useSWR from 'swr'

import { useSession } from 'next-auth/react'
import { UserFeedback } from '@/lib/types/user-feedback'

const fetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Failed to fetch:', error)
    throw new Error(error.message || 'Failed to fetch data')
  }

  return res.json()
}

export function useUserFeedback() {
  const { data: session } = useSession()

  const {
    data: feedbacks,
    error,
    mutate,
    isValidating,
  } = useSWR<UserFeedback[]>(
    session ? `/api/agencies` : null,
    (url) => {
      const token = session?.user?.id as string
      return fetcher(url, token)
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  )

  const createUserFeedback = async (feedbackData: Partial<UserFeedback>) => {
    const token = session?.user?.id as string

    if (!token) {
      throw new Error('Unauthorized')
    }

    const res = await fetch('/api/user-feedbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('Failed to create user feedback:', error)
      throw new Error(error.message || 'Failed to create user feedback')
    }

    const newFeedback = await res.json()

    mutate()

    return newFeedback
  }

  return {
    feedbacks: feedbacks || [],
    error,
    mutate,
    isLoading: isValidating,
    createUserFeedback,
  }
}
