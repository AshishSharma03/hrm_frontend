"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Download, FileText } from "lucide-react"
import GenerateOfferModal from "@/components/modals/generate-offer-modal"

export default function AdminOffersPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [offers, setOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/offers/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setOffers(data.data)
      }
    } catch (error) {
      console.error("Error fetching offers", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      fetchOffers()
    }
  }, [loading, user, userRole, router])

  const handleAction = async (offerId: string, action: string) => {
    if (action === 'revoke' && !confirm("Are you sure you want to revoke this offer?")) return
    alert(`${action} offer ${offerId}`)
  }

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
        <GenerateOfferModal onSubmit={() => fetchOffers()} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
            <p className="text-3xl font-bold">{offers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Generated</p>
            <p className="text-3xl font-bold text-blue-600">
              {offers.filter((o) => o.status === "generated").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Accepted</p>
            <p className="text-3xl font-bold text-green-600">
              {offers.filter((o) => o.status === "accepted").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.length === 0 && <p className="text-center text-muted-foreground py-8">No offers found.</p>}
        {offers.map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{offer.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{offer.position}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${offer.status === "generated" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}
                >
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Monthly Salary</p>
                <p className="text-2xl font-bold">₹{offer.salary}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleAction(offer.id, "edit")}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={offer.status !== "generated"}
                  onClick={() => handleAction(offer.id, "send")}
                >
                  <Send size={16} className="mr-2" />
                  Send to Candidate
                </Button>
                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleAction(offer.id, "revoke")}>
                  Revoke
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
