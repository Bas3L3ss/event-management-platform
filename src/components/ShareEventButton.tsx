"use client";

import React from "react";
import {
  FacebookMessengerShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  TelegramShareButton,
  RedditShareButton,
} from "react-share";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Share2, Mail, Link2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const ShareEventButton = ({
  eventId,
  eventName,
}: {
  eventId: string;
  eventName: string;
}) => {
  const shareUrl = `https://event-management-platform-baseproject.vercel.app/events/${eventId}`;
  const title = `Check out this amazing event called ${eventName}!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied",
      description: "The event link has been copied to your clipboard",
      duration: 3000,
    });
  };

  const shareOptions = [
    {
      name: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#0E65D9]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <FacebookShareButton url={shareUrl} quote={title} {...props} />
      ),
    },
    {
      name: "Messenger",
      color: "bg-[#0099FF] hover:bg-[#0077E6]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.36 2 2 6.13 2 11.7C2 14.85 3.5 17.18 6 18.63V23L10.3 20.72C10.86 20.81 11.43 20.85 12 20.85C17.64 20.85 22 16.72 22 11.15C22 6.13 17.64 2 12 2ZM13.32 15.5L10.5 12.5L5 15.5L11 9L13.83 12L19.33 9L13.32 15.5Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <FacebookMessengerShareButton
          url={shareUrl}
          appId="YOUR_FACEBOOK_APP_ID"
          {...props}
        />
      ),
    },
    {
      name: "Twitter",
      color: "bg-[#1DA1F2] hover:bg-[#0C85D0]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.19 14.41 4.53 14.44 3.87 14.31C4.38 16 5.88 17.25 7.58 17.29C6.13 18.45 4.38 19.13 2.5 19.13C2.22 19.13 1.94 19.11 1.67 19.07C3.44 20.29 5.5 21 7.81 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <TwitterShareButton url={shareUrl} title={title} {...props} />
      ),
    },
    {
      name: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#128C7E]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.6 6.32C16.12 4.82 14.06 4 12 4C7.72 4 4.23 7.5 4.23 11.78C4.23 13.38 4.67 14.96 5.5 16.3L4 20L7.8 18.5C9.1 19.24 10.54 19.63 12 19.63C16.28 19.63 19.77 16.13 19.77 11.85C19.78 9.8 18.96 7.77 17.6 6.32ZM12 18.28C10.67 18.28 9.38 17.9 8.24 17.18L8 17.05L5.8 18L6.73 15.88L6.58 15.64C5.78 14.46 5.38 13.12 5.38 11.76C5.38 8.18 8.4 5.15 12 5.15C13.74 5.15 15.4 5.84 16.62 7.06C17.84 8.28 18.53 9.94 18.53 11.68C18.53 15.28 15.6 18.28 12 18.28ZM15.85 13.27C15.63 13.16 14.43 12.57 14.23 12.5C14.03 12.42 13.9 12.39 13.73 12.61C13.58 12.83 13.14 13.38 13 13.53C12.88 13.68 12.74 13.7 12.53 13.58C11.32 12.98 10.5 12.5 9.68 11.16C9.45 10.78 9.97 10.8 10.45 9.83C10.53 9.67 10.49 9.53 10.44 9.42C10.39 9.31 9.87 8.11 9.69 7.67C9.5 7.25 9.31 7.31 9.18 7.3C9.05 7.29 8.92 7.29 8.78 7.29C8.64 7.29 8.39 7.34 8.19 7.56C7.99 7.78 7.36 8.37 7.36 9.57C7.36 10.77 8.25 11.93 8.37 12.07C8.5 12.21 9.86 14.31 11.95 15.34C13.5 16.06 14.07 16.13 14.79 16.03C15.23 15.97 16.2 15.45 16.39 14.92C16.58 14.39 16.58 13.95 16.53 13.86C16.47 13.77 16.35 13.71 16.12 13.59C15.88 13.47 15.85 13.27 15.85 13.27Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <WhatsappShareButton url={shareUrl} title={title} {...props} />
      ),
    },
    {
      name: "LinkedIn",
      color: "bg-[#0A66C2] hover:bg-[#084E96]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H6.5V10H9V17ZM7.7 8.7C6.8 8.7 6.1 8 6.1 7.1C6.1 6.2 6.8 5.5 7.7 5.5C8.6 5.5 9.3 6.2 9.3 7.1C9.3 8 8.6 8.7 7.7 8.7ZM18 17H15.5V13.3C15.5 12.5 14.9 11.9 14.1 11.9C13.3 11.9 12.7 12.5 12.7 13.3V17H10.2V10H12.7V11C13.1 10.4 14 10 14.9 10C16.4 10 17.8 11.4 17.8 12.9V17H18Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <LinkedinShareButton url={shareUrl} title={title} {...props} />
      ),
    },
    {
      name: "Telegram",
      color: "bg-[#26A5E4] hover:bg-[#0088CC]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4582 14.006 10.4252 13.9973 10.3938C13.9886 10.3624 13.9724 10.3337 13.95 10.31C13.89 10.26 13.81 10.28 13.74 10.29C13.65 10.31 12.15 11.34 9.24 13.39C8.83 13.67 8.46 13.8 8.12 13.8C7.75 13.8 7.03 13.58 6.5 13.4C5.84 13.17 5.32 13.05 5.36 12.69C5.38 12.5 5.64 12.31 6.14 12.11C9.25 10.73 11.35 9.78 12.45 9.28C15.57 7.82 16.2 7.59 16.64 7.58C16.74 7.58 16.97 7.61 17.12 7.73C17.24 7.83 17.27 7.97 17.28 8.07C17.27 8.18 17.28 8.48 17.26 8.8H16.64Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <TelegramShareButton url={shareUrl} title={title} {...props} />
      ),
    },
    {
      name: "Reddit",
      color: "bg-[#FF4500] hover:bg-[#E03D00]",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM18.5 11.5C18.5 12.33 17.83 13 17 13C16.67 13 16.4 12.9 16.17 12.75C15.14 13.5 13.64 14 12 14C10.36 14 8.86 13.5 7.83 12.75C7.6 12.9 7.33 13 7 13C6.17 13 5.5 12.33 5.5 11.5C5.5 10.89 5.86 10.37 6.39 10.15C6.36 10 6.34 9.84 6.34 9.67C6.34 7.84 8.88 6.34 12 6.34C15.12 6.34 17.66 7.84 17.66 9.67C17.66 9.84 17.64 10 17.61 10.15C18.14 10.37 18.5 10.89 18.5 11.5ZM8.5 11.75C9.14 11.75 9.75 11.14 9.75 10.5C9.75 9.86 9.14 9.25 8.5 9.25C7.86 9.25 7.25 9.86 7.25 10.5C7.25 11.14 7.86 11.75 8.5 11.75ZM15.25 14.36C14.07 15.53 9.93 15.53 8.75 14.36C8.56 14.16 8.56 13.86 8.75 13.67C8.95 13.47 9.25 13.47 9.44 13.67C10.23 14.45 13.77 14.45 14.56 13.67C14.75 13.47 15.05 13.47 15.25 13.67C15.44 13.86 15.44 14.16 15.25 14.36ZM15.5 11.75C16.14 11.75 16.75 11.14 16.75 10.5C16.75 9.86 16.14 9.25 15.5 9.25C14.86 9.25 14.25 9.86 14.25 10.5C14.25 11.14 14.86 11.75 15.5 11.75Z"
            fill="white"
          />
        </svg>
      ),
      button: (props: any) => (
        <RedditShareButton url={shareUrl} title={title} {...props} />
      ),
    },

    {
      name: "Copy Link",
      color: "bg-gray-500 hover:bg-gray-600",
      icon: <Link2 className="h-4 w-4 text-white" />,
      button: (props: any) => (
        <div {...props} onClick={copyToClipboard} className="cursor-pointer">
          {props.children}
        </div>
      ),
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-3 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-sm font-medium">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 rounded-lg shadow-lg">
        <div className="space-y-3">
          <h4 className="font-medium text-sm mb-1 px-2 pt-2">
            Share this event
          </h4>
          <div className="grid grid-cols-4 gap-2 pb-1">
            {shareOptions.map((option, index) => (
              <div key={index} className="relative group">
                <option.button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 rounded-full ${option.color} border-0 p-0 flex items-center justify-center shadow-sm hover:shadow transition-all duration-200`}
                  >
                    {option.icon}
                  </Button>
                </option.button>
                <div className=" w-max absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                  {option.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareEventButton;
