
'use server'

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({userIds}:{userIds:string[]}) => {

    try {

        const {data} = await clerkClient.users.getUserList({
            emailAddress:userIds
        })

        const users = data.map((u)=> ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email:u.emailAddresses[0].emailAddress,
            avatar: u.imageUrl
        }))



        const sortedUsers = userIds.map((email) => users.find(u => u.email === email))

        return parseStringify(sortedUsers)
        
    } catch (e:any) {
        console.log('Erro ao pegar usuario: ', e);
        
    }
}

export async function getDocumentUsers ({roomId, currentUser, text}:{roomId: string,currentUser:string,text:string}) {
    try {
        
        const room = await liveblocks.getRoom(roomId); 

        const users = Object.keys(room.usersAccesses).filter((email)=>email!==currentUser);

        if(text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((u)=>u.toLowerCase().includes(lowerCaseText))

            return parseStringify(filteredUsers)
        }

        return parseStringify(users)

    } catch (e:any) {

        console.log('Erro ao pegar usuários');
        
    }
} 