import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays, isWeekend, isBefore, startOfToday } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, sanitizeInput } from '@/lib/utils'
import emailjs from '@emailjs/browser'
import { toast } from 'sonner'
import { checkRateLimit, formatWaitTime } from '@/lib/rate-limit'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_cxb26d4'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID ?? 'template_g9qlawr'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'cKs7isxAB4tBNN7B7'

// Available time slots
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
]

// Service options with translation keys
const SERVICES = [
  { key: 'consultation', value: 'Consultation' },
  { key: 'strategy', value: 'Strategy Session' },
  { key: 'technical', value: 'Technical Review' },
  { key: 'project', value: 'Project Discussion' },
  { key: 'other', value: 'Other' }
]

export default function Booking() {
  const { t, i18n } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  // Get date locale based on current language
  const dateLocale = i18n.language === 'fr' ? fr : enUS

  // Form validation schema with translated error messages — memoized to avoid recreation
  const bookingSchema = useMemo(() =>
    z.object({
      name: z.string().min(2, t('booking.validation.nameRequired')),
      email: z.string().email(t('booking.validation.emailInvalid')),
      phone: z.string().optional(),
      service: z.string().min(1, t('booking.validation.serviceRequired')),
      date: z.date({ message: t('booking.validation.dateRequired') }),
      time: z.string().min(1, t('booking.validation.timeRequired')),
      notes: z.string().optional()
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  type BookingFormData = z.infer<typeof bookingSchema>

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      notes: ''
    }
  })

  const selectedDate = watch('date')
  const selectedTime = watch('time')
  const selectedService = watch('service')

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = startOfToday()
    return isBefore(date, today) || isWeekend(date)
  }

  const onSubmit = async (data: BookingFormData) => {
    // Honeypot — bots fill this, humans don't
    if (honeypot) return

    // Rate limit: max 3 bookings per 15 minutes
    const rl = checkRateLimit('booking')
    if (!rl.allowed) {
      toast.error(`Too many requests. Please wait ${formatWaitTime(rl.waitMs)}.`)
      return
    }

    setIsSubmitting(true)

    try {
      const safeDate = format(data.date, 'MMMM dd, yyyy')
      const templateParams = {
        from_name: sanitizeInput(data.name, 100),
        from_email: sanitizeInput(data.email, 254),
        phone: data.phone ? sanitizeInput(data.phone, 30) : 'Not provided',
        service: sanitizeInput(data.service, 50),
        date: safeDate,
        time: sanitizeInput(data.time, 20),
        notes: data.notes ? sanitizeInput(data.notes, 1000) : 'No additional notes',
        message: `Booking Request: ${sanitizeInput(data.service, 50)} on ${safeDate} at ${sanitizeInput(data.time, 20)}`
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      setIsSuccess(true)
      toast.success(t('booking.success.title'))

      setTimeout(() => {
        reset()
        setIsSuccess(false)
      }, 3000)
    } catch {
      toast.error(t('booking.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section id="booking" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-background/50 backdrop-blur-xl border-border/50">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('booking.success.title')}</h3>
              <p className="text-muted-foreground">
                {t('booking.success.message')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('booking.title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('booking.subtitle')}
          </p>
        </div>

        <Card className="bg-background/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>{t('booking.cardTitle')}</CardTitle>
            <CardDescription>
              {t('booking.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Honeypot — visually hidden, bots fill it, humans don't */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label htmlFor="hp_booking">Website</label>
                <input id="hp_booking" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              {/* Date and Time Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div className="space-y-2">
                  <Label htmlFor="booking-date">{t('booking.date')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="booking-date"
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !selectedDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate 
                          ? format(selectedDate, 'PPP', { locale: dateLocale }) 
                          : t('booking.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" sideOffset={4} avoidCollisions>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => setValue('date', date as Date)}
                        disabled={disabledDays}
                        fromDate={new Date()}
                        toDate={addDays(new Date(), 60)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>

                {/* Time Slot */}
                <div className="space-y-2">
                  <Label htmlFor="booking-time">{t('booking.time')}</Label>
                  <Select onValueChange={(value) => setValue('time', value)}>
                    <SelectTrigger id="booking-time" className={cn(!selectedTime && 'text-muted-foreground')}>
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue placeholder={t('booking.selectTime')} />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.time && (
                    <p className="text-sm text-red-500">{errors.time.message}</p>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="booking-name">
                    <User className="inline w-4 h-4 mr-1" />
                    {t('booking.fullName')}
                  </Label>
                  <Input
                    id="booking-name"
                    placeholder={t('booking.namePlaceholder')}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-email">
                    <Mail className="inline w-4 h-4 mr-1" />
                    {t('booking.email')}
                  </Label>
                  <Input
                    id="booking-email"
                    type="email"
                    placeholder={t('booking.emailPlaceholder')}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="booking-phone">
                    <Phone className="inline w-4 h-4 mr-1" />
                    {t('booking.phone')}
                  </Label>
                  <Input
                    id="booking-phone"
                    type="tel"
                    placeholder={t('booking.phonePlaceholder')}
                    {...register('phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-service">{t('booking.service')}</Label>
                  <Select onValueChange={(value) => setValue('service', value)}>
                    <SelectTrigger id="booking-service" className={cn(!selectedService && 'text-muted-foreground')}>
                      <SelectValue placeholder={t('booking.selectService')} />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((service) => (
                        <SelectItem key={service.key} value={service.value}>
                          {t(`booking.services.${service.key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.service && (
                    <p className="text-sm text-red-500">{errors.service.message}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="booking-notes">
                  <MessageSquare className="inline w-4 h-4 mr-1" />
                  {t('booking.notes')}
                </Label>
                <Textarea
                  id="booking-notes"
                  placeholder={t('booking.notesPlaceholder')}
                  rows={3}
                  {...register('notes')}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('booking.submitting')}
                  </>
                ) : (
                  t('booking.submit')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
