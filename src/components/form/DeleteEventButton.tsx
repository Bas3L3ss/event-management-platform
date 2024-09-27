"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy } from "lucide-react";

interface DeleteButtonProps {
  eventId: string;
  eventName: string;
  isPaid: boolean;
  deleteEvent: (id: string) => Promise<void>;
}

export default function DeleteEventButton({
  eventId,
  eventName,
  isPaid,
  deleteEvent,
}: DeleteButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      toast({
        title: "Copied!",
        description: `Order ID ${id} copied to clipboard`,
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDeleteConfirmation = async () => {
    if (confirmationInput.toLowerCase() === eventName.toLowerCase()) {
      try {
        await deleteEvent(eventId);
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
        });
        router.push("/events"); // Redirect to events page after deletion
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the event. Please try again.",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description:
          "The event name you entered does not match. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="font-normal text-xs cursor-pointer hover:text-blue-400">
            <DotsHorizontalIcon className="size-4" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(eventId);
            }}
          >
            {copiedId === eventId ? (
              <div className="flex gap-2">
                <span>Copied event Id</span>
                <Check className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex gap-2">
                <span>Copy event Id</span>
                <Copy className="h-4 w-4" />
              </div>
            )}
            <span className="sr-only">Copy Event Id</span>
          </DropdownMenuItem>
          {!isPaid && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                Delete Event
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this event?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Please type the event name to
              confirm deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Event Name
              </Label>
              <Input
                id="name"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                className="col-span-3"
                placeholder={`Type "${eventName}" to confirm`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmation}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
