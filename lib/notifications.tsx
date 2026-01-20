import { toast } from 'sonner'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

export const showNotification = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle2 className="w-5 h-5" />,
    })
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <AlertCircle className="w-5 h-5" />,
    })
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="w-5 h-5" />,
    })
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertTriangle className="w-5 h-5" />,
    })
  },

  loading: (message: string) => {
    return toast.loading(message)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, messages)
  },

  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  },
}
