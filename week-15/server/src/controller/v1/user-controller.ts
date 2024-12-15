import { Request, Response } from "express";
import {
  AddContentschema,
  shareBrainLinkschema,
  userAuthschema,
} from "../../types/types";
import crypto from "crypto";
import prisma from "../../db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { generateEmbedding, summarizeSearchResults } from "../../lib/embedding-service";
dotenv.config()

export const UserSignup = async (req: Request, res: Response) => {
  const signUpParsedData = userAuthschema.safeParse(req.body);
  if (!signUpParsedData.success) {
    res.status(411).json({
      message: "Error in inputs",
      error: signUpParsedData.error.errors,
    });
    return;
  }
  const { username, password } = signUpParsedData.data;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (existingUser) {
      res.status(403).json({
        message: "User already exists with this username.",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Signed up Successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const UserSignin = async (req: Request, res: Response) => {
  const signInParsedData = userAuthschema.safeParse(req.body);
  if (!signInParsedData.success) {
    res.status(411).json({
      message: "Error in inputs",
      error: signInParsedData.error.errors,
    });
    return;
  }
  const { username, password } = signInParsedData.data;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!existingUser) {
      res.status(403).json({
        message: "User does not exists.",
      });
      return;
    }
    const passwordValid = await bcrypt.compare(password, existingUser.password);
    if (!passwordValid) {
      res.status(403).json({
        message: "Incorrect password.",
      });
      return;
    }
    const userToken = jwt.sign(
      {
        userid: existingUser.id,
        username: existingUser.username,
      },
      process.env.JWT_SECRET as string
    );
    res.setHeader('Set-Cookie', [
      `token=${userToken}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; ${
        process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : 'SameSite=Lax'
      }`
    ]);
    console.log(userToken,'userToken')
    res.status(200).json({
      message: "Signed in Successfully",
      username: existingUser.username,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const AddContent = async (req: Request, res: Response) => {
  // console.log(req, 'req body');
  //@ts-ignore
  // console.log(req.file,req.body, 'req file');
  const parsedData = {
    title: req.body.title,
    type: req.body.type,
    link: req.body.type === 'LINK' ? req.body.link : req.body.type === 'ARTICLE' ? req.body.article:undefined,
    tags: req.body.tags ? 
      (Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags]) 
      : []
  };
  // console.log(parsedData,'parsee')
  //@ts-ignore
  // console.log(req?.file,'req file b4')

    //@ts-ignore
  if(parsedData.type==='IMAGE' && !req.file) {
    res.status(400).send({ message: "No image file provided" });
    return 
  }
  //@ts-ignore
  // console.log(req?.file,'req file')
  //@ts-ignore
  const imageUrl = req.file?.path ?? '';
  // console.log(imageUrl,'imageUrl')
  const { type, link, title, tags = [] } = parsedData;
  // console.log(AddContentParsedData.data,'here data')
  try {
    const embedding = await generateEmbedding(title);
    console.log(embedding,'embedding')
    const tagIds = await Promise.all(
      tags && tags.map(async (tagTitle: string) => {
        const existingTag = await prisma.tags.findUnique({
          where: { title: tagTitle },
        });
        if (existingTag) {
          return existingTag.id;
        }
        const newTag = await prisma.tags.create({ data: { title: tagTitle } });
        return newTag.id;
      })
    );
    console.log(tagIds,type,link,title,tags,'hello',req.user)
    const content = await prisma.content.create({
      data: {
        type: type,
        link:  type==='IMAGE' ? imageUrl : link! ,
        title: title,
        embedding:embedding,
        userId: req.user?.id as string,
      },
    });
    console.log(content,tagIds,'tagsiddd');
    if(tagIds && tagIds.length > 0){
      const tagsOncontentss = await prisma.tagsOnContent.createMany({
        data: tagIds.map((tagId: string) => ({
          contentId: content.id,
          tagId: tagId,
        })),
      });
    }
    // console.log(content, tagsOncontentss);
    res.status(200).json({
      message: "Content Added successfully",
      response: content,
    });
    return;
  } catch (error) {
    console.log('internal me',error)
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllContents = async (req: Request, res: Response) => {
  try {
    const contents = await prisma.content.findMany({
      where: {
        userId: req.user?.id,
      },
      include:{
        tags:{
          include:{
            tag: true
          }
      }
    }
    });
    const formattedContents = contents.map((content) => ({
      id: content.id,
      title: content.title,
      type: content.type,
      link: content.link,
      createdAt: content.createdAt,
      userId:content.userId,
      tags: content.tags.map((tagOnContent) => ({
        id: tagOnContent.tag.id,
        title: tagOnContent.tag.title,
      })),
    }));
    // console.log(contents,'conte',formattedContents)
    res.status(200).json({
      contents: formattedContents,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    return
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  if (!req.params.contentId) {
    res.status(400).json({ message: "id is required" });
    return;
  }
  try {
    // console.log(req.params.contentId)
    await prisma.content.delete({
      where: {
        id: req.params.contentId,
      },
    });
    res.status(200).json({
      message: `content deleted successfully with ${req.params.contentId}`,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
      error,
    });
    return;
  }
};

export const shareBrainLink = async (req: Request, res: Response) => {
  const parsedShareBrainLink = shareBrainLinkschema.safeParse(req.body);
  
  if (!parsedShareBrainLink.success) {
    res.status(400).json({
      message: "Invalid Inputs",
      error: parsedShareBrainLink.error.errors,
    });
    return 
  }

  if (!parsedShareBrainLink.data.share) {
    await prisma.link.deleteMany({
      where: { userId: req.user?.id }
    });
    res.status(200).json({ message: "Share link removed" });
    return 
  }

  try {
    const existingLink = await prisma.link.findFirst({
      where: { userId: req.user?.id }
    });

    if (existingLink) {
      res.status(200).json({
        link: `http://localhost:3000/brain/${existingLink.hash}`,
      });
      return 
    }

    const newShareLink = await prisma.link.create({
      data: {
        userId: req.user?.id as string,
        hash: crypto.randomBytes(16).toString("hex"),
      },
    });

    res.status(201).json({
      link: `http://localhost:3000/brain/${newShareLink.hash}`,
    });
  } catch (error) {
    console.error('Share link creation error:', error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const fetchSharedLinkContent = async (req: Request, res: Response) => {
  const shareLink = req.params.sharelink; 
  console.log(shareLink,'sharelink')
  try {
    const linkRecord = await prisma.link.findUnique({
      where: { hash: shareLink },
      select: { userId: true }
    });

    if (!linkRecord) {
      res.status(404).json({
        message: "Invalid share link",
      });
      return 
    }

    const contents = await prisma.content.findMany({
      where: {
        userId: linkRecord.userId,
      },
      include: {
        user: true,
        tags:{
          select:{
            tag:true
          }
        }
      },
    });
    console.log(contents,'contents')
    if (contents.length === 0) {
      res.status(404).json({
        message: "No content found",
        username: "",
        contents: [],
      });
      return 
    }
    const allContents = contents.map((content)=>({
      ...content,
      tags: content.tags.map((tagOnContent) => ({
        id: tagOnContent.tag.id,
        title: tagOnContent.tag.title,
      }))
    }))
    res.status(200).json({
      message:"Content fetched successfully",
      username: allContents[0]?.user?.username,
      contents: allContents,
    });
  } catch (error) {
    console.error('Fetch shared link content error:', error);
    res.status(500).json({ 
      message: "Internal Server Error", 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

export const UserLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during logout', error });
  }
};

export const performVectorSearch = async(req:Request,res:Response) =>{
    try {
      const query = req.query.query as string
      const userId = req.user?.id as string
      const embedding = await generateEmbedding(query);
  
      const pipeline = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: embedding,
            numCandidates: 10,
            limit: 5,
          },
        },
        {
          $match: {
            userId: { $oid: userId }
          }
        },
        {
          $project: {
            score: {
              $meta: "vectorSearchScore",
            },
            content: "$$ROOT",
          },
        },
      ];
      // console.log(pipeline,'pipe')
      const documents = (await prisma.content.aggregateRaw({pipeline})) as any ;
      console.log(documents,'doccsss')
      if (!documents || documents.length === 0) {
        res.status(404).send({ error: "No results found" });
        return;
      }
      const cleanedDocuments = documents.map((doc: { content: any; score: string; }) => {
        const { content, score } = doc;  
        const { embedding, ...cleanContent } = content;  
        return { content: cleanContent, score };
      });
      const result = await summarizeSearchResults(cleanedDocuments,query)
      res.send({
        summarizedContent: result
      });
    } catch (err) {
      console.error("Error during vector search:", err.message);
      res.status(500).send({ error: "Something went wrong" });
    }
  
}
