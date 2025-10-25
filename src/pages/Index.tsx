import { SoftwareTable } from "@/components/SoftwareTable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Software Inventory
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage and track all software systems across your organization
          </p>
        </header>
        
        <SoftwareTable />
      </div>
    </div>
  );
};

export default Index;
