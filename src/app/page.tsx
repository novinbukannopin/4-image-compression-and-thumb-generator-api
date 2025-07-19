import FormUpload from '@/components/ui/form-upload';

export default function Home() {
  return (
    <div className="grid items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to the Image Compression API
        </h1>
        <FormUpload />
      </main>
    </div>
  );
}
