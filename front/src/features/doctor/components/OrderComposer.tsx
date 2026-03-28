"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FlaskConical, ImageIcon, Stethoscope, X, Send } from "lucide-react";
import type { OrderCategory, Priority } from "@/types";
import { cn } from "@/lib/utils";

const categories: { key: OrderCategory; icon: typeof FlaskConical; label: string; color: string }[] = [
    { key: "lab", icon: FlaskConical, label: "Lab", color: "bg-teal-500/10 text-teal-600 border-teal-500/30" },
    { key: "imaging", icon: ImageIcon, label: "Imaging", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30" },
    { key: "consult", icon: Stethoscope, label: "Consult", color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30" },
];

const commonOrders: Record<OrderCategory, string[]> = {
    lab: ["CBC with Diff", "BMP", "CMP", "Lipid Panel", "HbA1c", "TSH", "Troponin I", "PT/INR", "Urinalysis", "Blood Culture"],
    imaging: ["Chest X-Ray", "CT Head", "CT Abdomen/Pelvis", "MRI Brain", "Echocardiogram", "Ultrasound Abdomen", "X-Ray Extremity"],
    consult: ["Cardiology", "Neurology", "Surgery", "Pulmonology", "Nephrology", "Endocrinology", "Psychiatry"],
    procedure: [],
};

interface OrderComposerProps {
    patientName?: string;
    onSubmit?: (orders: Array<{ category: OrderCategory; name: string; priority: Priority; notes: string }>) => void;
    className?: string;
}

export function OrderComposer({ patientName, onSubmit, className }: OrderComposerProps) {
    const [activeCategory, setActiveCategory] = useState<OrderCategory>("lab");
    const [search, setSearch] = useState("");
    const [priority, setPriority] = useState<Priority>("normal");
    const [notes, setNotes] = useState("");
    const [cart, setCart] = useState<Array<{ category: OrderCategory; name: string; priority: Priority; notes: string }>>([]);

    const filtered = commonOrders[activeCategory].filter((o) =>
        o.toLowerCase().includes(search.toLowerCase())
    );

    const addToCart = (name: string) => {
        if (!cart.find((c) => c.name === name && c.category === activeCategory)) {
            setCart((prev) => [...prev, { category: activeCategory, name, priority, notes }]);
        }
        setSearch("");
        setNotes("");
    };

    const removeFromCart = (idx: number) => {
        setCart((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = () => {
        onSubmit?.(cart);
        setCart([]);
    };

    return (
        <Card className={cn("border-border/50 shadow-sm", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        Order Composer
                    </CardTitle>
                    {patientName && <Badge variant="outline" className="text-xs">{patientName}</Badge>}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Category tabs */}
                <div className="flex items-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => { setActiveCategory(cat.key); setSearch(""); }}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                activeCategory === cat.key ? cat.color : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted"
                            )}
                        >
                            <cat.icon className="h-3 w-3" /> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Search + priority */}
                <div className="flex gap-2">
                    <Input
                        placeholder={`Search ${activeCategory} orders…`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 h-9 text-sm"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as Priority)}
                        className="flex h-9 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="stat">STAT</option>
                    </select>
                </div>

                {/* Quick-pick list */}
                <div className="flex flex-wrap gap-1.5">
                    {filtered.map((name) => {
                        const inCart = cart.some((c) => c.name === name && c.category === activeCategory);
                        return (
                            <button
                                key={name}
                                onClick={() => addToCart(name)}
                                disabled={inCart}
                                className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                                    inCart
                                        ? "bg-primary/10 text-primary border-primary/30 cursor-not-allowed"
                                        : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:border-border"
                                )}
                            >
                                {inCart ? "✓ " : "+ "}{name}
                            </button>
                        );
                    })}
                </div>

                {/* Cart */}
                {cart.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                        <p className="text-xs font-semibold text-muted-foreground">Pending Orders ({cart.length})</p>
                        {cart.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/50">
                                <Badge variant="outline" className="text-[10px] capitalize">{item.category}</Badge>
                                <span className="text-sm font-medium flex-1">{item.name}</span>
                                <Badge variant={item.priority === "stat" ? "destructive" : item.priority === "urgent" ? "default" : "secondary"} className="text-[10px]">
                                    {item.priority}
                                </Badge>
                                <button onClick={() => removeFromCart(idx)} className="text-muted-foreground hover:text-red-600">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                        <Button className="w-full gap-2 mt-2" onClick={handleSubmit}>
                            <Send className="h-3.5 w-3.5" /> Submit {cart.length} Order{cart.length > 1 ? "s" : ""}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
