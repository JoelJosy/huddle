import MindmapFlow from "@/components/smart/MindmapFlow";

interface Props {
  params: {
    noteId: string;
  };
}

export default async function Page({ params }: Props) {
  return <MindmapFlow noteId={(await params).noteId} />;
}
