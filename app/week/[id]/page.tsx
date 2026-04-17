import WeekForm from "@/components/WeekForm";

interface WeekPageProps {
  params: Promise<{ id: string }>;
}

export default async function WeekPage({ params }: WeekPageProps) {
  const { id } = await params;
  return <WeekForm id={id} />;
}
