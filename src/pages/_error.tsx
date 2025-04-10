import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const Error = () => {
    const router = useRouter();
    useEffect(() => {
        router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/application`)
    }, [router])

    return (
        <div>_error</div>
    )
}

export default Error