import { useState, useMemo } from "react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Download, Edit2, ArrowUpDown, GripVertical, Filter, X } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Status = "PRO" | "UAT" | "DEV" | "REQ";

interface SoftwareData {
  url: string;
  sno: string;
  software: string;
  description: string;
  status: Status;
  lastUpdate: string;
}

const initialData: SoftwareData[] = [
  { url: "10443", sno: "1", software: "LEAF", description: "Logistics Enquiry and Finalization", status: "PRO", lastUpdate: "" },
  { url: "443", sno: "2", software: "SPOT", description: "Smart Processing Of Tickets", status: "PRO", lastUpdate: "" },
  { url: "40443", sno: "3", software: "NEST", description: "Network for Equipment Spares Tracking", status: "PRO", lastUpdate: "" },
  { url: "50443", sno: "5", software: "INVEST", description: "Investor Breakdown", status: "PRO", lastUpdate: "" },
  { url: "60443", sno: "6", software: "AUDIT", description: "Audit Management System", status: "UAT", lastUpdate: "" },
  { url: "14443", sno: "23", software: "CCAS", description: "Code Creation Approval System", status: "PRO", lastUpdate: "" },
  { url: "30443", sno: "27", software: "MSSQL-Insert", description: "MSSQL Insertion Webapp (.xlsx --> mssql insertion)", status: "PRO", lastUpdate: "" },
  { url: "12443", sno: "8", software: "CERTS", description: "Certifications", status: "PRO", lastUpdate: "" },
  { url: "13443", sno: "29", software: "EPCs", description: "Marketing campaign data collection from EPCs", status: "UAT", lastUpdate: "" },
  { url: "15443", sno: "31", software: "Suryaghar Scraper", description: "Custom data scraper for Govt website to collect and analyse solar subsidy data by state on a daily basis", status: "PRO", lastUpdate: "" },
  { url: "16443", sno: "16", software: "WARRANTY", description: "Warranty Certificate Generation System", status: "UAT", lastUpdate: "Issed first customer warranty certificate: Oct 24, going live: Oct 27" },
  { url: "11443", sno: "7", software: "QAP", description: "Quality Assurance Protocol", status: "UAT", lastUpdate: "Currently on 3rd iteration of changes, solidyfying split workflow edge cases for QAP & BOM" },
  { url: "", sno: "4", software: "VISA", description: "Premier-Visa-Assist", status: "PRO", lastUpdate: "Integrating with Crypto-Esign for verified digital signatures, company seals and stamp paper" },
  { url: "", sno: "21", software: "SPOT-Admin", description: "Smart Processing Of Tickets for Admin Team", status: "DEV", lastUpdate: "" },
  { url: "", sno: "10", software: "LEAFI", description: "Logistics Enquiry and Finalization for Inbound Logistics", status: "DEV", lastUpdate: "" },
  { url: "", sno: "9", software: "WAVE", description: "Welcome & Authenticate Visitor Entry", status: "DEV", lastUpdate: "" },
  { url: "", sno: "11", software: "SAMPLES", description: "Sample Trial Tracking System", status: "DEV", lastUpdate: "" },
  { url: "", sno: "12", software: "MEETNBOOK", description: "Meeting Room Booking Management", status: "DEV", lastUpdate: "" },
  { url: "", sno: "13", software: "CARS", description: "Car Booking & Tracking System", status: "DEV", lastUpdate: "" },
  { url: "", sno: "14", software: "DIGI", description: "Unified SSO Portal", status: "DEV", lastUpdate: "" },
  { url: "", sno: "15", software: "ASSETS", description: "Asset Management System", status: "DEV", lastUpdate: "" },
  { url: "", sno: "17", software: "CEPS", description: "Capex Expenditure Proposal & Committee Approval System", status: "REQ", lastUpdate: "" },
  { url: "", sno: "18", software: "FABS", description: "Financial Analysis Business Software", status: "REQ", lastUpdate: "" },
  { url: "", sno: "19", software: "DMS", description: "Document Management System", status: "REQ", lastUpdate: "" },
  { url: "", sno: "20", software: "EMS", description: "Expenditure Management System", status: "REQ", lastUpdate: "" },
  { url: "", sno: "24", software: "Spares", description: "Spares Management System", status: "REQ", lastUpdate: "" },
  { url: "", sno: "25", software: "Cards", description: "Virtual Card Creation & Management Software", status: "REQ", lastUpdate: "" },
];

interface SortableRowProps {
  row: SoftwareData;
  onEdit: (row: SoftwareData) => void;
}

function SortableRow({ row, onEdit }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.sno });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getRowColor = (status: Status) => {
    switch (status) {
      case "PRO":
        return "bg-success/10 hover:bg-success/20";
      case "UAT":
        return "bg-warning/10 hover:bg-warning/20";
      case "DEV":
        return "bg-info/10 hover:bg-info/20";
      case "REQ":
        return "bg-neutral/10 hover:bg-neutral/20";
      default:
        return "hover:bg-muted/30";
    }
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`transition-colors ${getRowColor(row.status)}`}
    >
      <TableCell>
        <button
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-mono text-sm">{row.url || "-"}</TableCell>
      <TableCell>{row.sno}</TableCell>
      <TableCell className="font-semibold">{row.software}</TableCell>
      <TableCell className="min-w-[300px]">
        <p className="text-muted-foreground">{row.description}</p>
      </TableCell>
      <TableCell>
        <StatusBadge variant={row.status}>{row.status}</StatusBadge>
      </TableCell>
      <TableCell className="text-muted-foreground min-w-[250px]">
        {row.lastUpdate || "-"}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(row)}
          className="gap-2"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function SoftwareTable() {
  const [data, setData] = useState<SoftwareData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnFilters, setColumnFilters] = useState<{
    url: string;
    sno: string;
    software: string;
    description: string;
    status: string;
    lastUpdate: string;
  }>({
    url: "",
    sno: "",
    software: "",
    description: "",
    status: "",
    lastUpdate: "",
  });
  const [sortConfig, setSortConfig] = useState<{ key: keyof SoftwareData; direction: "asc" | "desc" } | null>(null);
  const [editingRow, setEditingRow] = useState<SoftwareData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSort = (key: keyof SoftwareData) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((row) => {
      const matchesSearch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesColumnFilters = 
        (columnFilters.url === "" || row.url.toLowerCase().includes(columnFilters.url.toLowerCase())) &&
        (columnFilters.sno === "" || row.sno.toLowerCase().includes(columnFilters.sno.toLowerCase())) &&
        (columnFilters.software === "" || row.software.toLowerCase().includes(columnFilters.software.toLowerCase())) &&
        (columnFilters.description === "" || row.description.toLowerCase().includes(columnFilters.description.toLowerCase())) &&
        (columnFilters.status === "" || row.status === columnFilters.status) &&
        (columnFilters.lastUpdate === "" || row.lastUpdate.toLowerCase().includes(columnFilters.lastUpdate.toLowerCase()));
      
      return matchesSearch && matchesColumnFilters;
    });
  }, [sortedData, searchTerm, columnFilters]);

  const clearFilters = () => {
    setColumnFilters({
      url: "",
      sno: "",
      software: "",
      description: "",
      status: "",
      lastUpdate: "",
    });
  };

  const hasActiveFilters = Object.values(columnFilters).some(filter => filter !== "");

  const handleEdit = (row: SoftwareData) => {
    setEditingRow({ ...row });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingRow) {
      setData((prevData) =>
        prevData.map((row) =>
          row.sno === editingRow.sno ? editingRow : row
        )
      );
      setIsDialogOpen(false);
      setEditingRow(null);
      toast.success("Changes saved successfully");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((item) => item.sno === active.id);
        const newIndex = items.findIndex((item) => item.sno === over.id);
        
        const newOrder = arrayMove(items, oldIndex, newIndex);
        toast.success("Row reordered successfully");
        return newOrder;
      });
    }
  };

  const handleExport = () => {
    const headers = ["URL", "SNo", "Software", "Description", "Status", "Last Update"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [row.url, row.sno, row.software, row.description, row.status, row.lastUpdate]
          .map((value) => `"${value}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `software-inventory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Table exported successfully");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline" size="sm" className="gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort("url")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        URL
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className={`h-3 w-3 ${columnFilters.url ? 'text-primary' : ''}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                          <Input
                            placeholder="Filter URL..."
                            value={columnFilters.url}
                            onChange={(e) => setColumnFilters({ ...columnFilters, url: e.target.value })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort("sno")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        SNo
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className={`h-3 w-3 ${columnFilters.sno ? 'text-primary' : ''}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                          <Input
                            placeholder="Filter SNo..."
                            value={columnFilters.sno}
                            onChange={(e) => setColumnFilters({ ...columnFilters, sno: e.target.value })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort("software")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Software
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className={`h-3 w-3 ${columnFilters.software ? 'text-primary' : ''}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                          <Input
                            placeholder="Filter Software..."
                            value={columnFilters.software}
                            onChange={(e) => setColumnFilters({ ...columnFilters, software: e.target.value })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      Description
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className={`h-3 w-3 ${columnFilters.description ? 'text-primary' : ''}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                          <Input
                            placeholder="Filter Description..."
                            value={columnFilters.description}
                            onChange={(e) => setColumnFilters({ ...columnFilters, description: e.target.value })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className={`h-3 w-3 ${columnFilters.status ? 'text-primary' : ''}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                          <Select
                            value={columnFilters.status}
                            onValueChange={(value) => setColumnFilters({ ...columnFilters, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All statuses</SelectItem>
                              <SelectItem value="PRO">PRO</SelectItem>
                              <SelectItem value="UAT">UAT</SelectItem>
                              <SelectItem value="DEV">DEV</SelectItem>
                              <SelectItem value="REQ">REQ</SelectItem>
                            </SelectContent>
                          </Select>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2">
                      Last Update
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Filter className={`h-3 w-3 ${columnFilters.lastUpdate ? 'text-primary' : ''}`} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60" align="start">
                          <Input
                            placeholder="Filter Last Update..."
                            value={columnFilters.lastUpdate}
                            onChange={(e) => setColumnFilters({ ...columnFilters, lastUpdate: e.target.value })}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={filteredData.map((row) => row.sno)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredData.map((row) => (
                    <SortableRow key={row.sno} row={row} onEdit={handleEdit} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Software Entry</DialogTitle>
          </DialogHeader>
          {editingRow && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={editingRow.url}
                  onChange={(e) => setEditingRow({ ...editingRow, url: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sno" className="text-right">
                  SNo
                </Label>
                <Input
                  id="sno"
                  value={editingRow.sno}
                  onChange={(e) => setEditingRow({ ...editingRow, sno: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="software" className="text-right">
                  Software
                </Label>
                <Input
                  id="software"
                  value={editingRow.software}
                  onChange={(e) => setEditingRow({ ...editingRow, software: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editingRow.description}
                  onChange={(e) => setEditingRow({ ...editingRow, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingRow.status}
                  onValueChange={(value: Status) => setEditingRow({ ...editingRow, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRO">PRO</SelectItem>
                    <SelectItem value="UAT">UAT</SelectItem>
                    <SelectItem value="DEV">DEV</SelectItem>
                    <SelectItem value="REQ">REQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastUpdate" className="text-right">
                  Last Update
                </Label>
                <Input
                  id="lastUpdate"
                  value={editingRow.lastUpdate}
                  onChange={(e) => setEditingRow({ ...editingRow, lastUpdate: e.target.value })}
                  className="col-span-3"
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
}
