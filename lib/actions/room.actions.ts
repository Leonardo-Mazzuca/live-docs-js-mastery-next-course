'use server'

import {nanoid} from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (e: any) {
    console.log("Erro ocorreu enquanto criava a sala: ", e);
  }
};

export const getDocument = async ({roomId, userId}:{roomId:string,userId:string})=> {


  try {

    const room = await liveblocks.getRoom(roomId)

    const hasAccess = Object.keys(room.usersAccesses).includes(userId)
  
    if(!hasAccess){
      throw new Error('Você não tem acesso a este documento!')
    }
  
    return parseStringify(room)
    
  } catch (e:any) {
    console.log('Erro enquanto entrava na sala: ', e);
    
  }


}

export const updateDocument = async (roomId:string,title:string) => {

  try {
    const updatedRoom = await liveblocks.updateRoom(roomId,{
      metadata: {
        title
      }
    })

    revalidatePath(`/document/${roomId}`)

    return parseStringify(updatedRoom)
  } catch (e:any) {
    console.log('Erro ao atualizar a sala');
    
  }
}

export const getDocuments = async (email:string)=> {


  try {

    const rooms = await liveblocks.getRooms({
      userId:email
    })

    return parseStringify(rooms)
    
  } catch (e:any) {
    console.log('Erro enquanto pegava todas as salas: ', e);
    
  }


}

export const updateDocumentAccess = async ({roomId, email, userType,updatedBy}:ShareDocumentParams) => {

  try {
    const usersAccesses:RoomAccesses = {
      [email] : getAccessType(userType) as AccessType
    }

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses
    })

    if(room){
      //TODO: Send notification
    }

    revalidatePath(`/document/${roomId}`)
    return parseStringify(room)

  } catch (e:any) {
      console.log('Erro happens update document access');
      
  }
  
}

export const removeCollaborator = async ({roomId,email}:{roomId:string,email:string}) => {

  try {
    const room = await liveblocks.getRoom(roomId);

    if(room.metadata.email === email) {
      throw new Error('You cannot remove yourself!')
    }

    const updatedRoom = await liveblocks.updateRoom(roomId,{
      usersAccesses: {
        [email]:null
      }
    })

    revalidatePath(`/document/${roomId}`)
    return parseStringify(updatedRoom)

  } catch (e:any) {
    console.log(`Erro happened while deleting user ${email}`);
    
  }
}

export const deleteDocument = async (roomId:string) => {
  try {

    await liveblocks.deleteRoom(roomId);
    revalidatePath('/')
    redirect('/')
    
  } catch (e:any) {

    console.log('Erro happened while deleting document', e);
    
  }
}