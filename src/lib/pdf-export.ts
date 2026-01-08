import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MealPlanDetail, Recipe, ShoppingListItem, Ingredient } from '@/types/database.types';

// 导出膳食计划为 PDF
export function exportMealPlanToPDF(
  meals: (MealPlanDetail & { recipe?: Recipe })[],
  userName: string = '用户'
): void {
  const doc = new jsPDF();
  
  // 设置中文字体 (需要在生产环境中添加中文字体支持)
  doc.setFont('helvetica', 'normal');
  
  // 标题
  doc.setFontSize(20);
  doc.text('7天膳食计划', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`用户: ${userName}`, 20, 35);
  doc.text(`生成日期: ${new Date().toLocaleDateString('zh-CN')}`, 20, 42);
  
  // 按日期分组
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
      
      // 日期标题
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${index + 1} - ${new Date(date).toLocaleDateString('zh-CN')}`, 20, yPos);
      yPos += 10;
      
      // 该天的餐食表格
      const dayMeals = groupedMeals[date];
      const tableData = dayMeals.map((meal) => [
        getMealTypeLabel(meal.meal_type),
        meal.recipe?.name_en || 'Unknown',
        `${meal.recipe?.prep_time || 0} + ${meal.recipe?.cook_time || 0} min`,
        '450 kcal', // TODO: 从 nutrition 表获取
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
  
  // 保存PDF
  doc.save(`meal-plan-${new Date().toISOString().split('T')[0]}.pdf`);
}

// 导出购物清单为 PDF
export function exportShoppingListToPDF(
  items: (ShoppingListItem & { ingredient?: Ingredient })[],
  totalCost: number
): void {
  const doc = new jsPDF();
  
  // 标题
  doc.setFontSize(20);
  doc.text('Weekly Shopping List', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US')}`, 20, 35);
  doc.text(`Total Estimated Cost: RM ${totalCost.toFixed(2)}`, 20, 42);
  
  // 按类别分组
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
    
    // 类别标题
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(category, 20, yPos);
    yPos += 8;
    
    // 该类别的食材表格
    const categoryItems = groupedItems[category];
    const tableData = categoryItems.map((item) => [
      item.ingredient?.name_en || 'Unknown',
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
  
  // 保存PDF
  doc.save(`shopping-list-${new Date().toISOString().split('T')[0]}.pdf`);
}

// 辅助函数
function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
  };
  return labels[type] || type;
}



