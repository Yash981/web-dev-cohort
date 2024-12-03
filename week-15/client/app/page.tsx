import NotesCards from "@/components/all-notes-cards";
import HomeComponent from "@/components/home-component";
import { getAllContents } from "@/actions/contents";
export interface Tag{
  id:string,
  title:string
}
export interface ContentsProp {
  id:string;
  link?: string,
  image?:string,
  type:  'IMAGE' | 'ARTICLE' | 'LINK',
  title: string,
  createdAt: string,
  tags: Tag[]

}
export default async function Home() {
  const contents = await getAllContents()
  // console.log('/',contents)
  if (!contents || contents.contents.length === 0) {
    return (
      <>
        <div className="w-full flex flex-col items-center justify-center min-h-[500px] gap-2">
            <h1 className="text-2xl text-gray-500">No contents found.</h1>
            <HomeComponent noContent={true}/>
        </div>
      </>
    );
}
  return (
    <div className="w-full flex flex-col flex-wrap">
      <HomeComponent />
      <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 p-4">
        {contents && contents.contents.map((content: ContentsProp, index: number) => {
          return (
          <div className="break-inside-avoid mb-6" key={index}>
          <NotesCards link={content.link} type={content.type} key={index} title={content.title} createdAt={content.createdAt} tags={content.tags} id={content?.id}/>
          </div>
          )
        })}
      </div>
    </div>
  );
}
