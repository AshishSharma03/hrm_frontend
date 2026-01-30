"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import GenerateOfferModal from "@/components/modals/generate-offer-modal"
import { FileText, CheckCircle, XCircle, Clock, Mail } from "lucide-react"

interface Offer {
  id: string
  candidateEmail: string
  candidateName?: string
  position: string
  department: string
  salary: number | string
  status: string
  createdAt: string
  expiryDate?: string
}

export default function RecruiterOffersPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 })

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/offers/all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setOffers(data.data || [])
        calculateStats(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching offers", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (offerList: Offer[]) => {
    const pending = offerList.filter(o => o.status === 'pending' || o.status === 'sent').length
    const accepted = offerList.filter(o => o.status === 'accepted').length
    const rejected = offerList.filter(o => o.status === 'rejected' || o.status === 'revoked').length
    setStats({
      total: offerList.length,
      pending,
      accepted,
      rejected
    })
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    } else if (!loading) {
      fetchOffers()
    }
  }, [loading, user, userRole, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'sent': return 'bg-yellow-100 text-yellow-700'
      case 'accepted': return 'bg-green-100 text-green-700'
      case 'rejected':
      case 'revoked': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'sent': return <Clock size={14} />
      case 'accepted': return <CheckCircle size={14} />
      case 'rejected':
      case 'revoked': return <XCircle size={14} />
      default: return <FileText size={14} />
    }
  }

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <GenerateOfferModal onSubmit={() => fetchOffers()} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Offers</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Accepted</p>
                <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100">
                <XCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers List */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Letters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {offers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No offers generated yet.</p>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg">{offer.candidateName || offer.candidateEmail}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail size={14} />
                      {offer.candidateEmail}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                    {getStatusIcon(offer.status)}
                    {offer.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Position</p>
                    <p className="font-medium">{offer.position}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">{offer.department}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Salary</p>
                    <p className="font-medium">₹{typeof offer.salary === 'number' ? offer.salary.toLocaleString() : offer.salary}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{new Date(offer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" variant="outline">View Details</Button>
                  {(offer.status === 'pending' || offer.status === 'sent') && (
                    <>
                      <Button size="sm" variant="outline">Resend</Button>
                      <Button size="sm" variant="destructive">Revoke</Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
