import { fetchShareBrainLink } from "@/app/actions/fetch-brain-action";
import NotesCards from "@/components/all-notes-cards";

const FetchSharedContents = async ({
    params
}: {
    params: { sharelink: string }
}) => {
    const fetchSharedContents = await fetchShareBrainLink(params.sharelink)
    if (!fetchSharedContents || fetchSharedContents.contents.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[500px]">
                <h1 className="text-2xl text-gray-500">No shared contents found</h1>
            </div>
        );
    }
    return (
        <>
            <div className="w-full flex flex-col flex-wrap">
                <h1 className="text-3xl mx-auto font-bold">    {fetchSharedContents.username?.toUpperCase() || 'UNKNOWN'}&apos;s Shared Notes
                </h1>
                <div className="mr-10 ml-10 flex gap-2 flex-wrap justify-start items-start">
                    {fetchSharedContents && fetchSharedContents.contents.map((content: any, index: number) => {
                        return <NotesCards
                            link={content.link}
                            type={content.type}
                            key={index}
                            title={content.title}
                            createdAt={content.createdAt}
                            tags={content.tags}
                            id={content?.id}
                        />
                    })}
                </div>
            </div>
        </>
    );
}

export default FetchSharedContents;