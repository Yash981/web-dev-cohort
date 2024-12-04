import { fetchShareBrainLink } from "@/actions/fetch-brain-action";
import NotesCards from "@/components/all-notes-cards";

const FetchSharedContents = async ({
    params
}: {
    params: { sharelink: string }
}) => {
    const fetchSharedContents = await fetchShareBrainLink(params.sharelink)
    if (fetchSharedContents && fetchSharedContents.contents.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[500px]">
                <h1 className="text-2xl text-gray-500">No shared contents found</h1>
            </div>
        );
    }
    if(!fetchSharedContents){
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[500px]">
                <h1 className="text-2xl text-gray-500">Invalid Link</h1>
            </div>
        );
    }
    return (
        <>
            <div className="w-full flex flex-col flex-wrap">
                <h1 className="text-3xl mx-auto font-bold mt-5">    {fetchSharedContents.username?.toUpperCase() || 'UNKNOWN'}&apos;s Shared Notes
                </h1>
                <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 p-4 mt-10">
                    {fetchSharedContents && fetchSharedContents.contents.map((content: any, index: number) => {
                        return (
                            <div className="break-inside-avoid mb-6" key={index}>
                        <NotesCards
                            link={content.link}
                            type={content.type}
                            key={index}
                            title={content.title}
                            createdAt={content.createdAt}
                            tags={content.tags}
                            id={content?.id}
                        />
                        </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
}

export default FetchSharedContents;