'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useSelf } from '@liveblocks/react/suspense';
import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./user-type-selector";
import Collaborator from "./collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

const ShareModal = ({
    roomId,
    creatorId,
    collaborators,
    currentUserType
}:ShareDocumentDialogProps) => {

  const user = useSelf()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('')

  const [userType, setUserType] = useState<UserType>('viewer')

  const shareDocumentHandler = async () => {
    setLoading(true)

    await updateDocumentAccess({
        roomId,
        email,
        userType: userType as UserType,
        updatedBy: user.info
    })

    setLoading(false)
  }


  return (
    <Dialog  onOpenChange={setOpen} open={open}>
        <DialogTrigger>
            <Button disabled={currentUserType!=='editor'} className="gradient-blue flex h-9 gap-1 px-4">
                <Image 
                    src={"/assets/icons/share.svg"}
                    alt="share"
                    width={20}
                    height={20}
                    className="min-w-4 md:size-5"
                />
                <p className="mr-1 hidden sm:block">
                    Share
                </p>
            </Button>
        </DialogTrigger>
        <DialogContent  className="shad-dialog">
            <DialogHeader>
            <DialogTitle>Manage who can view this project</DialogTitle>
            <DialogDescription>
                Select which users can view and see this document
            </DialogDescription>
            </DialogHeader>

            <Label className="mt-6 text-blue-100" htmlFor="email">
                Email address
            </Label>
            <div className="flex items-center gap-3">
                <div className="flex flex-1 rounded-md bg-dark-400">
                    <Input
                        id="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="share-input"
                     />
                     <UserTypeSelector
                        userType={userType}
                        setUserType={setUserType}
                     />
                </div>
                <Button disabled={loading} className="gradient-blue flex h-full gap-1 px-5" onClick={shareDocumentHandler} type="submit">

                        {loading ? "Sending..." : "Invite"}

                </Button>
            </div>

            <div className="my-2 space-y-2">
                <ul className="flex flex-col">

                    {collaborators.map(c => (
                        <Collaborator
                            key={c.id}
                            roomId={roomId}
                            creatorId={creatorId}
                            email={c.email}
                            collaborator={c}
                            user={user.info}
                        />
                    ))}

                </ul>
            </div>
        </DialogContent>
    </Dialog>

  )

}

export default ShareModal