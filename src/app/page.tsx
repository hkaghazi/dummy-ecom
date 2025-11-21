import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Input id="framework" placeholder="Next.js 16" disabled />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <p className="text-muted-foreground text-sm">Hello</p>
      </div>
    </main>
  )
}
