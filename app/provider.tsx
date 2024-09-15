

'use client'
import React, { PropsWithChildren } from 'react'
import {ClientSideSuspense, LiveblocksProvider} from '@liveblocks/react/suspense'
import Loader from '@/components/loader'
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.actions'
import { useUser } from '@clerk/nextjs'

const Provider = ({children}:PropsWithChildren) => {

  const {user:clerkUser} = useUser();

  return (
    <LiveblocksProvider 
        authEndpoint={"/api/liveblocks-auth"}
        resolveUsers={async ({userIds})=> {
          const users = await getClerkUsers({userIds});
          return users
        }}
        resolveMentionSuggestions={async ({text,roomId})=> {
          const roomsUsers = await getDocumentUsers({
            roomId,
            currentUser: clerkUser?.emailAddresses[0].emailAddress!,
            text
          });

          return roomsUsers
        }}
    >

      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>

  </LiveblocksProvider>
  )
}

export default Provider