import BusinessInfoForm from "./BusinessInfoForm";


export default function BusinessRegistrationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Register Your Business</h1>
        <BusinessInfoForm />
      </div>
    </div>
  )
}