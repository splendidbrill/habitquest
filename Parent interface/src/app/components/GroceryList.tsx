import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Check, Copy, Mail, Printer, ShoppingCart, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";
import { Checkbox } from "./ui/checkbox";

interface GroceryItem {
  id: string;
  item: string;
  category: string;
  checked: boolean;
}

export function GroceryList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "tesco">("list");
  const [groceries, setGroceries] = useState<GroceryItem[]>([
    // Based on this week's meal plan - personalized
    { id: "1", item: "Yellow lentils (toor dal)", category: "Pantry", checked: false },
    { id: "2", item: "Basmati rice (2kg bag)", category: "Pantry", checked: false },
    { id: "3", item: "Tomatoes (6)", category: "Fresh Produce", checked: false },
    { id: "4", item: "Carrots (500g)", category: "Fresh Produce", checked: false },
    { id: "5", item: "Spinach (bag)", category: "Fresh Produce", checked: false },
    { id: "6", item: "Onions (4)", category: "Fresh Produce", checked: false },
    { id: "7", item: "Cucumber (2)", category: "Fresh Produce", checked: false },
    { id: "8", item: "Frozen peas", category: "Frozen", checked: false },
    { id: "9", item: "Chicken breast (600g)", category: "Meat", checked: false },
    { id: "10", item: "Natural yogurt (large pot)", category: "Dairy", checked: false },
    { id: "11", item: "Eggs (dozen)", category: "Dairy", checked: false },
    { id: "12", item: "Mild curry powder", category: "Spices", checked: false },
    { id: "13", item: "Cumin seeds", category: "Spices", checked: false },
    { id: "14", item: "Turmeric", category: "Spices", checked: false },
    { id: "15", item: "Fresh coriander", category: "Fresh Produce", checked: false },
    { id: "16", item: "Garlic (bulb)", category: "Fresh Produce", checked: false },
    { id: "17", item: "Ginger root", category: "Fresh Produce", checked: false },
    { id: "18", item: "Chapatis or wraps", category: "Bakery", checked: false },
    { id: "19", item: "Football for park", category: "Other", checked: false },
  ]);

  const toggleItem = (id: string) => {
    setGroceries(
      groceries.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const categories = Array.from(new Set(groceries.map((item) => item.category)));

  const handleCopyList = () => {
    const text = groceries
      .filter((item) => !item.checked)
      .map((item) => `☐ ${item.item}`)
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  const handleEmailList = () => {
    const text = groceries
      .filter((item) => !item.checked)
      .map((item) => `- ${item.item}`)
      .join("\n");
    window.location.href = `mailto:?subject=HealthySteps Grocery List&body=${encodeURIComponent(text)}`;
  };

  const totalItems = groceries.length;
  const checkedItems = groceries.filter((item) => item.checked).length;

  const handleExportToTesco = () => {
    // Mock implementation - in a real app, this would integrate with Tesco API
    const itemsText = groceries
      .filter((item) => !item.checked)
      .map((item) => item.item)
      .join(", ");

    // Simulating redirect to Tesco with items
    alert("In a production app, this would export your list to Tesco online shopping.\n\nYour items:\n" + itemsText);

    // In production, this would be something like:
    // window.open(`https://www.tesco.com/groceries/add-to-basket?items=${encodeURIComponent(itemsText)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/parent-dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="mb-1">Grocery List</h1>
            <p className="text-sm text-muted-foreground">
              {checkedItems}/{totalItems} items checked
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-card border border-border rounded-lg p-1">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 px-4 py-2 rounded-md transition-all ${
              activeTab === "list"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Shopping List</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("tesco")}
            className={`flex-1 px-4 py-2 rounded-md transition-all ${
              activeTab === "tesco"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Tesco Export</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "list" && (
          <>
            {/* Info Card */}
            <Card className="p-4 mb-6 bg-accent border-accent">
              <p className="text-sm text-accent-foreground">
                <span className="font-medium">💰 Budget tip:</span> This list is
                designed for about £25-30 at most supermarkets. All ingredients are
                for this week's meal plan.
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Button variant="outline" size="sm" onClick={handleCopyList}>
                <Copy className="w-4 h-4 mr-2" />
                Copy list
              </Button>
              <Button variant="outline" size="sm" onClick={handleEmailList}>
                <Mail className="w-4 h-4 mr-2" />
                Email me
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>

            {/* Grocery Items by Category */}
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="mb-3 text-primary">{category}</h3>
                  <div className="space-y-2">
                    {groceries
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <Card
                          key={item.id}
                          className={`p-4 cursor-pointer transition-all ${
                            item.checked
                              ? "bg-accent/50 border-secondary"
                              : "hover:shadow-sm"
                          }`}
                          onClick={() => toggleItem(item.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox checked={item.checked} />
                            <span
                              className={
                                item.checked
                                  ? "line-through text-muted-foreground"
                                  : ""
                              }
                            >
                              {item.item}
                            </span>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            {checkedItems === totalItems && (
              <Card className="p-5 mt-6 bg-gradient-to-br from-secondary/20 to-primary/10 border-secondary/30 text-center">
                <Check className="w-12 h-12 text-secondary mx-auto mb-3" />
                <h3 className="mb-2">All done! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  You've got everything for this week's meals
                </p>
              </Card>
            )}
          </>
        )}

        {activeTab === "tesco" && (
          <>
            {/* Tesco Export Info */}
            <Card className="p-5 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Export to Tesco Online</h3>
                  <p className="text-sm text-muted-foreground">
                    Send your shopping list directly to your Tesco online basket. Save time
                    and shop from home!
                  </p>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-5 mb-6">
              <h4 className="mb-3">How it works:</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    Review your items below to make sure everything looks right
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    Click "Export to Tesco" to add items to your online basket
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-medium text-primary">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">
                    Complete your order on Tesco.com or in the Tesco app
                  </p>
                </div>
              </div>
            </Card>

            {/* Items to Export */}
            <Card className="p-5 mb-6">
              <h4 className="mb-3">Items to export ({groceries.filter(item => !item.checked).length}):</h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {groceries
                  .filter((item) => !item.checked)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg"
                    >
                      <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{item.item}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            {/* Export Button */}
            <Button
              className="w-full mb-4"
              size="lg"
              onClick={handleExportToTesco}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Export to Tesco Online Shopping
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            {/* Note */}
            <Card className="p-4 bg-accent border-accent">
              <p className="text-xs text-accent-foreground">
                <span className="font-medium">Note:</span> You'll need a Tesco online account
                to complete your order. Items may vary by availability at your local store.
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
