"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock } from "lucide-react"

interface RequestsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const mockRequests = [
  {
    id: "1",
    from: "Brett",
    to: "Cami",
    duration: 60,
    preferredTime: new Date("2025-02-10T19:00:00"),
    status: "Pending",
    type: "received",
  },
  {
    id: "2",
    from: "Cami",
    to: "Brett",
    duration: 90,
    preferredTime: new Date("2025-02-12T14:00:00"),
    status: "Pending",
    type: "sent",
  },
]

export function RequestsDrawer({ isOpen, onClose }: RequestsDrawerProps) {
  const [requests] = useState(mockRequests)

  const receivedRequests = requests.filter((r) => r.type === "received")
  const sentRequests = requests.filter((r) => r.type === "sent")

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-white w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl text-pink-600">Call Requests</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="received" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-pink-100">
            <TabsTrigger value="received" className="relative">
              Received
              {receivedRequests.length > 0 && <Badge className="ml-2 bg-pink-500">{receivedRequests.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="sent" className="relative">
              Sent
              {sentRequests.length > 0 && <Badge className="ml-2 bg-pink-500">{sentRequests.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4 mt-4">
            {receivedRequests.map((request) => (
              <div key={request.id} className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-sans font-semibold text-pink-700">From {request.from}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {request.duration} minutes
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100">
                    {request.status}
                  </Badge>
                </div>

                <div className="text-sm space-y-1 mb-4">
                  <div>
                    London:{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: "Europe/London",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.preferredTime)}
                  </div>
                  <div>
                    Los Angeles:{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      timeZone: "America/Los_Angeles",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.preferredTime)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                    <Check className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-destructive bg-transparent">
                    <X className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}

            {receivedRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No received requests</div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 mt-4">
            {sentRequests.map((request) => (
              <div key={request.id} className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-sans font-semibold text-pink-700">To {request.to}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {request.duration} minutes
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100">
                    {request.status}
                  </Badge>
                </div>

                <div className="text-sm space-y-1">
                  <div>
                    London:{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: "Europe/London",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.preferredTime)}
                  </div>
                  <div>
                    Los Angeles:{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      timeZone: "America/Los_Angeles",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(request.preferredTime)}
                  </div>
                </div>
              </div>
            ))}

            {sentRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No sent requests</div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
