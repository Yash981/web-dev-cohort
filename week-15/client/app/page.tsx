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
      <div className="mr-10 ml-10 flex gap-2 flex-wrap justify-start items-start">
        {contents && contents.contents.map((content: ContentsProp, index: number) => {
          return <NotesCards link={content.link} type={content.type} key={index} title={content.title} createdAt={content.createdAt} tags={content.tags} id={content?.id}/>
        })}
      </div>
    </div>
  );
}
