'use client';

import { useParams } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function RoomsPage() {
    const { id } = useParams<{ id: string }>();
    redirect(`/landlord/properties/${id}`);
}
