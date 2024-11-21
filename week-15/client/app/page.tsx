import NotesCards from "@/components/all-notes-cards";
import HomeComponent from "@/components/home-component";
import { getAllContents } from "./actions/contents";
export interface Tag{
  id:string,
  tag:string
}
export interface ContentsProp {
  link: string,
  type: 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'LINK',
  title: string,
  createdAt: string,
  tags: Tag[]

}
export default async function Home() {
  const contents = await getAllContents()
  // console.log(contents.contents)
  return (
    <div className="w-full p-2">
      <HomeComponent />
      <div className="mr-10 flex gap-2">
        {contents && contents.contents.map((content: ContentsProp, index: number) => {
          // { console.log(content, 'map') }
          return <NotesCards link={content.link} type={content.type} key={index} title={content.title} createdAt={content.createdAt} tags={content.tags}/>
        })

        }
      </div>
    </div>
  );
}
