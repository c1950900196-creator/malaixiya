import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MealPlanDetail, Recipe, ShoppingListItem, Ingredient } from '@/types/database.types';

// Export meal plan to PDF
export function exportMealPlanToPDF(
  meals: (MealPlanDetail & { recipe?: Recipe })[],
  userName: string = 'User'
): void {
  const doc = new jsPDF();
  
  doc.setFont('helvetica', 'normal');
  
  // Title
  doc.setFontSize(20);
  doc.text('7-Day Meal Plan', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`User: ${userName}`, 20, 35);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 20, 42);
  
  // Group by date
  const groupedMeals: { [date: string]: (MealPlanDetail & { recipe?: Recipe })[] } = {};
  meals.forEach((meal) => {
    if (!groupedMeals[meal.date]) {
      groupedMeals[meal.date] = [];
    }
    groupedMeals[meal.date].push(meal);
  });
  
  let yPos = 55;
  
  Object.keys(groupedMeals)
    .sort()
    .forEach((date, index) => {
      if (index > 0 && yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Date title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${index + 1} - ${new Date(date).toLocaleDateString('en-US')}`, 20, yPos);
      yPos += 10;
      
      // Meals table for this day
      const dayMeals = groupedMeals[date];
      const tableData = dayMeals.map((meal) => [
        getMealTypeLabel(meal.meal_type),
        meal.recipe?.name_en || 'Unknown',
        `${meal.recipe?.prep_time || 0} + ${meal.recipe?.cook_time || 0} min`,
        '450 kcal', // TODO: Get from nutrition table
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Meal Type', 'Recipe', 'Time', 'Calories']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [56, 224, 123] },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    });
  
  // Save PDF
  doc.save(`meal-plan-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Get ingredient display name (use English for PDF)
function getIngredientName(item: ShoppingListItem & { ingredient?: Ingredient }): string {
  // notes format: "Chinese | English | Bahasa Malaysia"
  // PDF doesn't support Chinese, use second part (English name)
  if (item.notes) {
    const parts = item.notes.split('|');
    const englishName = parts[1]?.trim();  // Second part is English
    const malayName = parts[2]?.trim();    // Third part is Malay
    if (englishName) return englishName;
    if (malayName) return malayName;
  }
  
  // Fallback to ingredient relation data
  return item.ingredient?.name_en || 
         item.ingredient?.name_ms || 
         'Unknown';
}

// Export shopping list to PDF
export function exportShoppingListToPDF(
  items: (ShoppingListItem & { ingredient?: Ingredient })[],
  totalCost: number
): void {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Weekly Shopping List', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, 20, 35);
  doc.text(`Total Estimated Cost: RM ${totalCost.toFixed(2)}`, 20, 42);
  
  // Group by category
  const groupedItems: { [category: string]: (ShoppingListItem & { ingredient?: Ingredient })[] } = {};
  items.forEach((item) => {
    const category = item.category || 'Others';
    if (!groupedItems[category]) {
      groupedItems[category] = [];
    }
    groupedItems[category].push(item);
  });
  
  let yPos = 55;
  
  Object.keys(groupedItems).forEach((category, index) => {
    if (index > 0 && yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    // Category title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(category, 20, yPos);
    yPos += 8;
    
    // Items table for this category
    const categoryItems = groupedItems[category];
    const tableData = categoryItems.map((item) => [
      getIngredientName(item),
      `${item.quantity} ${item.unit}`,
      `RM ${(item.estimated_price || 0).toFixed(2)}`,
      '☐', // Checkbox
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Ingredient', 'Quantity', 'Price', 'Purchased']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [56, 224, 123] },
      columnStyles: {
        3: { halign: 'center' },
      },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 12;
  });
  
  // Save PDF
  doc.save(`shopping-list-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Helper function
function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };
  return labels[type] || type;
}
