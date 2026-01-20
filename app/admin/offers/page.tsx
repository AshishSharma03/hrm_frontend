"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Download, Plus } from "lucide-react"
import { FileText } from "lucide-react"
import GenerateOfferModal from "@/components/modals/generate-offer-modal"

export default function AdminOffersPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [offers] = useState([
    {
      id: "OFF001",
      candidateName: "Alex Johnson",
      position: "Senior Developer",
      salary: "15,00,000",
      status: "draft",
      createdDate: "2024-01-20",
    },
    {
      id: "OFF002",
      candidateName: "Maria Garcia",
      position: "Product Manager",
      salary: "12,00,000",
      status: "sent",
      createdDate: "2024-01-18",
    },
  ])

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={3} />
        <SkeletonTable />
      </main>
    )
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <GenerateOfferModal
          onSubmit={(data) => {
            console.log("Offer generated:", data)
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
            <p className="text-3xl font-bold">15</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Draft</p>
            <p className="text-3xl font-bold text-blue-600">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Sent</p>
            <p className="text-3xl font-bold text-green-600">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{offer.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{offer.position}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    offer.status === "draft" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
                <p className="text-2xl font-bold">₹{offer.salary}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={offer.status === "sent"}>
                  <Send size={16} className="mr-2" />
                  Send to Candidate
                </Button>
                <Button size="sm" variant="outline">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
    </main>
  )
}
