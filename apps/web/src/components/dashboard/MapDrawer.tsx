"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUiStore } from "@/store/uiStore"
import { usePipelineStore } from "@/store/pipelineStore"
import { MapPin, Navigation, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MapDrawer() {
  const isOpen = useUiStore((state) => state.mapDrawerOpen)
  const closeMapDrawer = useUiStore((state) => state.closeMapDrawer)
  const actions = usePipelineStore((state) => state.actions)
  const [selectedLocation, setSelectedLocation] = React.useState<any>(null)

  const locations = actions?.mapLocations || []

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeMapDrawer()}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-4xl flex flex-col h-full overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>Nearby Voting Resources</DrawerTitle>
            <DrawerDescription>
              Find registration offices and polling stations near you.
            </DrawerDescription>
          </DrawerHeader>

          <Tabs defaultValue="list" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 pb-2">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full px-4">
                <div className="space-y-4 pb-8">
                  {locations.length > 0 ? (
                    locations.map((loc, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="mt-1 p-2 rounded-full bg-primary/10 text-primary">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{loc.name}</h4>
                              <p className="text-sm text-muted-foreground">{loc.address}</p>
                              <div className="mt-2 flex gap-4 text-xs">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> Open until 5 PM
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" /> Contact
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="icon" variant="outline" className="rounded-full">
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center">
                      <MapPin className="h-12 w-12 mx-auto text-muted mb-4 opacity-20" />
                      <p className="text-muted-foreground">No locations found for this stage.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="map" className="flex-1 m-0 relative overflow-hidden bg-muted">
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">Interactive Map Loading...</p>
                    <div className="aspect-video w-full max-w-md bg-card rounded-lg border shadow-inner flex items-center justify-center">
                       {/* Placeholder for real Google Map */}
                       <MapPin className="h-8 w-8 text-primary animate-bounce" />
                    </div>
                 </div>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
