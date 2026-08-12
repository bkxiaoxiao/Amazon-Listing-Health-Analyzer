// Amazon Listing Health Analyzer - Popup Script (Optimized with Real-Time EN/CN Language Translation & CDQ Audit)

document.addEventListener("DOMContentLoaded", () => {
  // Navigation Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-content-panel");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const targetTab = btn.getAttribute("data-tab");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Category Profile Switcher
  const profileDropdown = document.getElementById("category-profile");
  let activeData = null;

  profileDropdown.addEventListener("change", () => {
    if (activeData) {
      runAnalysis(activeData);
    }
  });

  // -------------------------------------------------------------
  // Language Translations Dictionary (i18n)
  // -------------------------------------------------------------
  let currentLanguage = localStorage.getItem("analyzer_lang") || "zh"; // Default to Chinese

  const i18n = {
    en: {
      titleExtension: "Amazon Listing Analyzer",
      lblCategory: "Category:",
      optAuto: "Auto-Detect",
      optStandard: "Standard Goods",
      optElectronics: "Consumer Electronics",
      readyScan: "Ready to Scan",
      readyScanDesc: "Please open a product detail page on any global Amazon marketplace (e.g., amazon.com, amazon.co.uk, amazon.cn) to begin analysis.",
      scanning: "Crawling product attributes and performing canvas pixel background checks...",
      healthScore: "Health Score",
      profile: "ASIN Profile",
      marketplace: "Marketplace",
      brand: "Brand Found",
      tabOverview: "Overview",
      tabImages: "Images",
      tabContent: "Content",
      tabSpecs: "Specs",
      tabSuggestions: "Suggestions",
      lblTitle: "Checks length, prefix, and repetition.",
      lblImages: "Checks counts, background, and zoom capabilities.",
      lblDescription: "Checks description text and A+ rich content presence.",
      lblSpecs: "Evaluates key attribute completeness.",
      lblTrust: "Evaluates reviews volume and rating score.",
      titleTitle: "Title compliance",
      titleImages: "Images & Resolution",
      titleDescription: "Description & A+",
      titleSpecs: "Specifications fill",
      titleTrust: "Customer ratings & reviews",
      langBtn: "中文"
    },
    zh: {
      titleExtension: "亚马逊 Listing 分析助手",
      lblCategory: "品类设置:",
      optAuto: "智能判别",
      optStandard: "普通商品",
      optElectronics: "消费电子",
      readyScan: "准备就绪",
      readyScanDesc: "请在任意亚马逊全球站点（如 amazon.com、amazon.co.uk、amazon.cn）打开产品详情页开始体检。",
      scanning: "正在提取详情页属性并执行主图 Canvas 像素级纯白背景分析...",
      healthScore: "健康得分",
      profile: "类目属性",
      marketplace: "销售站点",
      brand: "检测品牌",
      tabOverview: "核心体检",
      tabImages: "主图合规",
      tabContent: "文案排版",
      tabSpecs: "关键属性",
      tabSuggestions: "优化建议",
      lblTitle: "诊断标题字符长度、品牌先导词和防降权字词重复度。",
      lblImages: "检测副图数量、缩放（Zoom）尺寸和主图纯白背景。",
      lblDescription: "检测描述长文本和 A+ 富媒体品牌内容的填充状态。",
      lblSpecs: "评估叶子节点分类和详情规格属性的填写丰富度。",
      lblTrust: "分析 Ratings 累积数量和星级得分等信任安全指标。",
      titleTitle: "标题合规性",
      titleImages: "主图与尺寸",
      titleDescription: "详情描述与 A+",
      titleSpecs: "属性完整度 (CDQ)",
      titleTrust: "星级与评论 (Trust)",
      langBtn: "EN"
    }
  };

  function applyLanguage() {
    const lang = currentLanguage;
    const trans = i18n[lang];

    document.getElementById("title-extension").textContent = trans.titleExtension;
    document.getElementById("lbl-category-profile").textContent = trans.lblCategory;
    document.getElementById("opt-auto").textContent = trans.optAuto;
    document.getElementById("opt-standard").textContent = trans.optStandard;
    document.getElementById("opt-electronics").textContent = trans.optElectronics;
    
    // State panels
    document.querySelector("#state-not-amazon h3").textContent = trans.readyScan;
    document.querySelector("#state-not-amazon p").textContent = trans.readyScanDesc;
    document.querySelector("#state-scanning p").textContent = trans.scanning;

    // Tabs
    const tabs = document.querySelectorAll(".tab-btn");
    tabs[0].textContent = trans.tabOverview;
    tabs[1].textContent = trans.tabImages;
    tabs[2].textContent = trans.tabContent;
    tabs[3].textContent = trans.tabSpecs;
    tabs[4].innerHTML = `${trans.tabSuggestions} (<span id="suggestion-count">0</span>)`;

    // Dashboard score labels
    document.querySelector(".score-label").textContent = trans.healthScore;
    document.querySelectorAll(".stat-lbl")[0].textContent = trans.profile;
    document.querySelectorAll(".stat-lbl")[1].textContent = trans.marketplace;
    document.querySelectorAll(".stat-lbl")[2].textContent = trans.brand;

    // Overview Items titles & descriptions
    const chkTitle = document.getElementById("chk-title");
    chkTitle.querySelector("h4").textContent = trans.titleTitle;
    const chkImages = document.getElementById("chk-images");
    chkImages.querySelector("h4").textContent = trans.titleImages;
    const chkDesc = document.getElementById("chk-description");
    chkDesc.querySelector("h4").textContent = trans.titleDescription;
    const chkSpecs = document.getElementById("chk-specs");
    chkSpecs.querySelector("h4").textContent = trans.titleSpecs;
    const chkTrust = document.getElementById("chk-trust");
    chkTrust.querySelector("h4").textContent = trans.titleTrust;

    // Static description lines
    document.getElementById("lbl-title").textContent = trans.lblTitle;
    document.getElementById("lbl-images").textContent = trans.lblImages;
    document.getElementById("lbl-description").textContent = trans.lblDescription;
    document.getElementById("lbl-specs").textContent = trans.lblSpecs;
    document.getElementById("lbl-trust").textContent = trans.lblTrust;

    // Image tab metric rows
    document.querySelectorAll("#tab-images .metric-name")[0].textContent = lang === "zh" ? "副图数量" : "Image Count";
    document.querySelectorAll("#tab-images .metric-name")[1].textContent = lang === "zh" ? "主图缩放尺寸 (>=1600px)" : "Main Image Zoom (>=1600px)";
    document.querySelectorAll("#tab-images .metric-name")[2].textContent = lang === "zh" ? "主图背景颜色 (纯白)" : "Background Check (Pure White)";

    // Content tab metric rows
    document.querySelectorAll("#tab-content .metric-name")[0].textContent = lang === "zh" ? "标题字符长度" : "Title Character Count";
    document.querySelectorAll("#tab-content .metric-name")[1].textContent = lang === "zh" ? "标题首词为品牌" : "Title Starts with Brand";
    document.querySelectorAll("#tab-content .metric-name")[2].textContent = lang === "zh" ? "标题字词重复 (2025新规)" : "Title Repetition Check (2025 Rule)";
    document.querySelectorAll("#tab-content .metric-name")[3].textContent = lang === "zh" ? "5点描述数量" : "Bullet Points Count";
    document.querySelectorAll("#tab-content .metric-name")[4].textContent = lang === "zh" ? "产品详情长文本" : "Product Description Present";
    document.querySelectorAll("#tab-content .metric-name")[5].textContent = lang === "zh" ? "A+ 品牌内容激活" : "A+ Rich Content Activated";

    // Specs tab metric rows
    document.querySelectorAll("#tab-specs .metric-name")[0].textContent = lang === "zh" ? "详情页分类节点" : "Marketplace Leaf Node";
    document.querySelectorAll("#tab-specs .metric-name")[1].textContent = lang === "zh" ? "已填规格行数" : "Specification Rows (Key Attributes)";
    document.querySelectorAll("#tab-specs .metric-name")[2].textContent = lang === "zh" ? "星级评分 (信任度)" : "Rating Score (Trust)";
    document.querySelectorAll("#tab-specs .metric-name")[3].textContent = lang === "zh" ? "评论数量 (信任度)" : "Review Count (Trust)";

    // Update Language Button label
    document.getElementById("lang-switch-btn").textContent = trans.langBtn;
  }

  // Bind Language switch trigger
  const langSwitchBtn = document.getElementById("lang-switch-btn");
  langSwitchBtn.addEventListener("click", () => {
    currentLanguage = currentLanguage === "zh" ? "en" : "zh";
    localStorage.setItem("analyzer_lang", currentLanguage);
    applyLanguage();
    if (activeData) {
      runAnalysis(activeData);
    }
  });

  // Apply initial translations
  applyLanguage();

  // Query Active Tab and Analyze
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url) {
      showState("state-not-amazon");
      return;
    }

    const isAmazon = activeTab.url.includes("amazon.com") || 
                     activeTab.url.includes("amazon.co.uk") || 
                     activeTab.url.includes("amazon.de") || 
                     activeTab.url.includes("amazon.fr") || 
                     activeTab.url.includes("amazon.it") || 
                     activeTab.url.includes("amazon.es") || 
                     activeTab.url.includes("amazon.co.jp") || 
                     activeTab.url.includes("amazon.cn") || 
                     activeTab.url.includes("amazon.in") || 
                     activeTab.url.includes("amazon.ca") || 
                     activeTab.url.includes("amazon.com.mx") || 
                     activeTab.url.includes("amazon.com.br") || 
                     activeTab.url.includes("amazon.com.au") || 
                     activeTab.url.includes("amazon.nl") || 
                     activeTab.url.includes("amazon.se") || 
                     activeTab.url.includes("amazon.pl") || 
                     activeTab.url.includes("amazon.com.tr") || 
                     activeTab.url.includes("amazon.sg") || 
                     activeTab.url.includes("amazon.ae") || 
                     activeTab.url.includes("amazon.sa");

    if (!isAmazon) {
      showState("state-not-amazon");
      return;
    }

    showState("state-scanning");

    // Send a scan message to the content script
    chrome.tabs.sendMessage(activeTab.id, { action: "scanListing" }, async (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        // Fallback: Try injecting content script manually if it failed to load
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["content.js"]
        }, () => {
          if (chrome.runtime.lastError) {
            showState("state-not-amazon");
            return;
          }
          // Retry sending message after manual injection
          setTimeout(() => {
            chrome.tabs.sendMessage(activeTab.id, { action: "scanListing" }, async (retryResponse) => {
              if (retryResponse && retryResponse.success) {
                processScrapedData(retryResponse.data);
              } else {
                showState("state-not-amazon");
              }
            });
          }, 300);
        });
      } else {
        processScrapedData(response.data);
      }
    });
  });

  async function processScrapedData(scrapedData) {
    activeData = scrapedData;
    runAnalysis(scrapedData);
  }

  // Core Scoring, CDQ Audit & Analysis Engine
  async function runAnalysis(scrapedData) {
    showState("state-scanning");

    // 1. Analyze image background color & natural resolution asynchronously using clean URL
    let bgIsWhite = false;
    let actualWidth = scrapedData.mainImageResolution.width;
    let actualHeight = scrapedData.mainImageResolution.height;

    if (scrapedData.mainImage) {
      try {
        const imageResult = await checkImageBackground(scrapedData.mainImage);
        bgIsWhite = imageResult.isWhite;
        if (actualWidth === 0 || actualHeight === 0) {
          actualWidth = imageResult.width;
          actualHeight = imageResult.height;
        }
      } catch (e) {
        console.error("Image background validation error", e);
      }
    }

    // 2. Auto-detect category profile if set to 'auto'
    let selectedProfile = profileDropdown.value;
    if (selectedProfile === "auto") {
      selectedProfile = detectCategory(scrapedData);
      
      const labelAutoText = currentLanguage === "zh" ? " (智能判别)" : " (Auto)";
      const labelProfileText = selectedProfile === "electronics" ? (currentLanguage === "zh" ? "消费电子" : "Electronics") : (currentLanguage === "zh" ? "普通商品" : "Standard");
      document.getElementById("profile-detected").textContent = labelProfileText + labelAutoText;
    } else {
      document.getElementById("profile-detected").textContent = selectedProfile === "electronics" ? (currentLanguage === "zh" ? "消费电子" : "Electronics") : (currentLanguage === "zh" ? "普通商品" : "Standard Goods");
    }

    // 3. Title analysis details
    const titleWords = getTitleWordRepetitions(scrapedData.title);
    const hasRepeatedWords = titleWords.some(w => w.count > 2);
    
    // Robust brand starting prefix check (strips Japanese/Chinese brackets like 【】 or [])
    const checkTitleStartsWithBrand = (title, brand) => {
      if (!title || !brand) return false;
      const cleanT = title.trim().replace(/^[【\[\(\{\s·“"”]+/, "").toLowerCase();
      const cleanB = brand.toLowerCase();
      if (cleanT.startsWith(cleanB)) return true;
      
      const brandFirstWord = cleanB.split(/\s+/)[0];
      const titleFirstWord = cleanT.split(/[^a-zA-Z0-9]/)[0];
      if (brandFirstWord && titleFirstWord && brandFirstWord === titleFirstWord) return true;
      return false;
    };

    const titleStartsWithBrand = checkTitleStartsWithBrand(scrapedData.title, scrapedData.brand);
    const titleLengthOk = scrapedData.title.length > 10 && scrapedData.title.length < 200;

    // 4. Score calculation based on categories
    let score = 0;
    const suggestions = [];

    // Scoring checklist variables for overview visualization
    let chkTitleStatus = "passed";
    let chkImagesStatus = "passed";
    let chkDescriptionStatus = "passed";
    let chkSpecsStatus = "passed";
    let chkTrustStatus = "passed";

    // ---------------------------------------------
    // CDQ COMPLIANCE ANALYSIS GRID (0-100% Core Data Quality)
    // ---------------------------------------------
    let cdqScore = 0;

    // TIER 1: Basic completeness (Max 50 pts)
    if (scrapedData.title.length > 10) cdqScore += 10;
    const hasBrandText = scrapedData.brand && scrapedData.brand.toLowerCase() !== "generic" && scrapedData.brand.toLowerCase() !== "generic brand";
    if (hasBrandText) cdqScore += 10;
    if (scrapedData.hasLeafNode) cdqScore += 10;
    if (scrapedData.hasDescription) cdqScore += 10;
    if (scrapedData.bulletPoints.length >= 5) {
      cdqScore += 10;
    } else if (scrapedData.bulletPoints.length >= 3) {
      cdqScore += 5;
    }

    // TIER 2: Golden Core Attributes (Max 30 pts - 6 pts each)
    let goldenFoundCount = 0;
    const goldenChecks = {
      material: ["material", "材质", "fabric type", "composition", "ingredient", "leather", "cotton", "wood", "plastic", "metal", "alloy"],
      capacity: ["capacity", "volume", "容量", "fluid capacity", "liquid", "ounces", "ml", "liter"],
      dimensions: ["dimension", "size", "尺寸", "product dimensions", "item dimensions", "package dimensions", "width", "height", "length"],
      weight: ["weight", "重量", "item weight", "shipping weight", "ounces", "grams", "lbs", "kg"],
      color: ["color", "颜色", "colour", "shade", "hue", "finish"]
    };

    const specsKeys = Object.keys(scrapedData.specsMap);
    const specsValuesString = JSON.stringify(scrapedData.specsMap).toLowerCase();

    // Scan specifications map for golden fields
    for (const [field, keywords] of Object.entries(goldenChecks)) {
      const match = keywords.some(keyword => {
        return specsKeys.some(key => key.includes(keyword)) || specsValuesString.includes(keyword);
      });
      if (match) {
        goldenFoundCount++;
        cdqScore += 6;
      } else {
        suggestions.push({
          title: currentLanguage === "zh" ? `CDQ核心：未填 ${field === "material" ? "产品材质" : field === "capacity" ? "产品容量" : field === "dimensions" ? "产品尺寸" : field === "weight" ? "产品重量" : "产品颜色"}` : `CDQ Core: Missing ${field.toUpperCase()}`,
          desc: currentLanguage === "zh" ? `黄金核心规格字段 '${field}' 尚未在技术属性表中定义。补齐属性能够大幅拉高 A+ 页面曝光索引。` : `The required Golden Core Attribute '${field}' is not defined in specifications. Complete properties to boost index ranking.`,
          impact: "Medium",
          action: currentLanguage === "zh" ? `立即在卖家后台详情页编辑模块补全 '${field}' 细节参数。` : `Add '${field}' detail fields inside Seller Central product templates.`
        });
      }
    }

    // TIER 3: Key Product Characteristics (Max 20 pts - 10 pts each)
    let characteristicsFound = 0;
    if (selectedProfile === "electronics") {
      // Electronics specific CDQ checks
      const powerKeywords = ["connector", "power interface", "charging", "input", "output", "interface", "电源接口", "接口", "usb", "port", "volt", "battery type"];
      const powerMatch = powerKeywords.some(kw => specsValuesString.includes(kw) || specsKeys.some(k => k.includes(kw)));
      if (powerMatch) { characteristicsFound++; cdqScore += 10; }

      const wattKeywords = ["wattage", "power", "voltage", "功率", "电压", "watts", "ampere", "mah", "capacity"];
      const wattMatch = wattKeywords.some(kw => specsValuesString.includes(kw) || specsKeys.some(k => k.includes(kw)));
      if (wattMatch) { characteristicsFound++; cdqScore += 10; }

      if (!powerMatch) {
        suggestions.push({
          title: currentLanguage === "zh" ? "CDQ 消费电子：未填电源接口" : "CDQ Electronics: Power Connection Sparse",
          desc: currentLanguage === "zh" ? "技术属性表中缺少输入/输出端口或充电电源接口等必要技术说明。" : "No technical power interface or charging connector description found in product details.",
          impact: "Medium",
          action: currentLanguage === "zh" ? "请在后台完善 'Connector Type' 或 '电源接口' 属性。" : "Define 'Connector Type' or 'Power Interface' attributes."
        });
      }
      if (!wattMatch) {
        suggestions.push({
          title: currentLanguage === "zh" ? "CDQ 消费电子：未填功率参数" : "CDQ Electronics: Power Specification Missing",
          desc: currentLanguage === "zh" ? "未发现额定功率、电压或电池毫安数等核心用电规格，这对过滤器检索非常重要。" : "Listing is missing Wattage / Power attributes which are golden fields for electronics search filters.",
          impact: "Medium",
          action: currentLanguage === "zh" ? "请在技术参数中录入功率 (Wattage) 或电压 (Voltage) 属性。" : "Add 'Wattage' or 'Power Consumption' parameters under specs."
        });
      }
    } else {
      // Fashion/Standard Goods CDQ Checks (Sizing, color, target gender)
      const genderKeywords = ["department", "gender", "applicable people", "适用人群", "部门", "target group", "women", "men", "unisex", "girls", "boys", "child"];
      const genderMatch = genderKeywords.some(kw => specsValuesString.includes(kw) || specsKeys.some(k => k.includes(kw)));
      if (genderMatch) { characteristicsFound++; cdqScore += 10; }

      const sizeChartKeywords = ["size chart", "sizing", "尺码表", "fit type", "size map", "chest size", "waist size"];
      const sizeChartMatch = sizeChartKeywords.some(kw => specsValuesString.includes(kw) || specsKeys.some(k => k.includes(kw))) || scrapedData.title.toLowerCase().includes("size");
      if (sizeChartMatch) { characteristicsFound++; cdqScore += 10; }

      if (!genderMatch) {
        suggestions.push({
          title: currentLanguage === "zh" ? "CDQ 服饰商品：未填适用人群" : "CDQ Apparel/Standard: Target Audience Missing",
          desc: currentLanguage === "zh" ? "未填报适用人群/性别分类。买家在侧边栏利用性别漏斗筛选搜索结果时，您的产品会被过滤掉。" : "Listing lacks Department/Target Audience specifications (e.g. Adult, Men, Women, Kids). Users cannot filter your product in search.",
          impact: "Medium",
          action: currentLanguage === "zh" ? "在编辑页面中填入 'Department' (男士、女士、儿童) 等销售对象信息。" : "Set the 'Department' field inside product description catalog options."
        });
      }
      if (!sizeChartMatch) {
        suggestions.push({
          title: currentLanguage === "zh" ? "CDQ 服饰商品：未填尺码图" : "CDQ Apparel/Standard: Sizing Map Missing",
          desc: currentLanguage === "zh" ? "详情页未检测到明确的尺码维度信息或尺码转换表，这很容易导致退货率偏高。" : "Listing has no size maps, size charts, or clear sizing scales populated.",
          impact: "Medium",
          action: currentLanguage === "zh" ? "请将商品尺码对照维度表格填入规格表，或上传专门的尺码图。" : "Publish a clear size dimension matrix or upload a Sizing Chart image."
        });
      }
    }

    // ---------------------------------------------
    // HEALTH SCORE STANDARDS (100 Point Weight Grid)
    // ---------------------------------------------
    if (selectedProfile === "electronics") {
      // Category Leaf Node (20)
      if (scrapedData.hasLeafNode) score += 20;
      else chkSpecsStatus = "failed";

      // Search Keywords (10)
      score += 10;

      // A+ Content (10)
      if (scrapedData.hasAPlus) score += 10;
      else chkDescriptionStatus = "warning";

      // Product Description (10)
      if (scrapedData.hasDescription) score += 10;
      else chkDescriptionStatus = "failed";

      // Key Specs (25)
      if (scrapedData.specsCount >= 8) score += 25;
      else if (scrapedData.specsCount >= 4) { score += 15; chkSpecsStatus = "warning"; }
      else { score += 5; chkSpecsStatus = "failed"; }

      // Title Length (5)
      if (titleLengthOk) score += 5;
      else chkTitleStatus = "warning";

      // Image Compliance (5)
      if (bgIsWhite) score += 5;
      else chkImagesStatus = "warning";

      // Image Count >=4 (5)
      if (scrapedData.images.length >= 4) score += 5;
      else chkImagesStatus = "warning";

      // Image Zoom >=1600px (10)
      const isZoomable = actualWidth >= 1600 || actualHeight >= 1600;
      if (isZoomable) score += 10;
      else chkImagesStatus = "warning";

      // Add general violations
      if (hasRepeatedWords) chkTitleStatus = "failed";

    } else {
      // STANDARD GOODS:
      // Category Leaf Node (10)
      if (scrapedData.hasLeafNode) score += 10;
      else chkSpecsStatus = "failed";

      // Search Keywords (5)
      score += 5;

      // A+ Content (12.5)
      if (scrapedData.hasAPlus) score += 12.5;
      else chkDescriptionStatus = "warning";

      // Brand Name (5)
      const hasBrand = scrapedData.brand && scrapedData.brand.toLowerCase() !== "generic";
      if (hasBrand) score += 5;
      else chkSpecsStatus = "warning";

      // Product Description (5)
      if (scrapedData.hasDescription) score += 5;
      else chkDescriptionStatus = "failed";

      // Bullet Point 1 (5)
      if (scrapedData.bulletPoints.length >= 1) score += 5;
      else chkDescriptionStatus = "failed";

      // Bullet Points >=3 (2.5)
      if (scrapedData.bulletPoints.length >= 3) score += 2.5;
      else if (scrapedData.bulletPoints.length > 0) chkDescriptionStatus = "warning";

      // Key Specs (25)
      if (scrapedData.specsCount >= 6) score += 25;
      else if (scrapedData.specsCount >= 3) { score += 15; chkSpecsStatus = "warning"; }
      else { score += 5; chkSpecsStatus = "failed"; }

      // Title Length (5)
      if (titleLengthOk) {
        score += 5;
        if (scrapedData.title.length > 80) {
          suggestions.push({
            title: currentLanguage === "zh" ? "优化建议：缩短标题利于移动端适配" : "Title Length: Improve Mobile Compatibility",
            desc: currentLanguage === "zh" ? `当前标题字符数为 ${scrapedData.title.length}。2025新规建议在移动端将标题控制在 80 字符以内，防止首屏剪裁。` : `Current title length is ${scrapedData.title.length} characters. The 2025 update strongly recommends keeping titles under 8 character words (approx 80 characters) to avoid mobile trimming.`,
            impact: "Info",
            action: currentLanguage === "zh" ? "精简长标题，核心词保留在前 80 字符中。" : "Shorten title to <= 80 characters for perfect mobile formatting."
          });
        }
      } else {
        chkTitleStatus = "warning";
      }

      // Title starts with Brand (5)
      if (titleStartsWithBrand) score += 5;
      else chkTitleStatus = "warning";

      // Image Compliance (5)
      if (bgIsWhite) score += 5;
      else chkImagesStatus = "warning";

      // Image Count >=4 (5)
      if (scrapedData.images.length >= 4) score += 5;
      else chkImagesStatus = "warning";

      // Image Zoom >=1600px (10)
      const isZoomable = actualWidth >= 1600 || actualHeight >= 1600;
      if (isZoomable) score += 10;
      else chkImagesStatus = "warning";

      if (hasRepeatedWords) chkTitleStatus = "failed";
    }

    // 2025 Word repetition warnings
    if (hasRepeatedWords) {
      const repeatedList = titleWords.filter(w => w.count > 2).map(w => `"${w.word}"`).join(", ");
      suggestions.push({
        title: currentLanguage === "zh" ? "2025新规：标题词汇重复违规" : "2025 Rule: Title Word Repetition Violation",
        desc: currentLanguage === "zh" ? `标题中关键词 ${repeatedList} 重复出现了 2 次以上。根据亚马逊 2025 年 1 月 21 日生效的新规，字词堆叠将被 AI 强行剔除并可能导致检索降权。` : `The keyword(s) ${repeatedList} are repeated more than twice. Amazon's Jan 21, 2025 update suppresses listings with title repetitions.`,
        impact: "Critical",
        action: currentLanguage === "zh" ? "立刻前往后台修改，删除多余的重复堆砌词。" : "Remove duplicate/repeated keywords from your title immediately."
      });
    }

    // 5. Trust factor evaluation (Rating & Reviews)
    if (scrapedData.rating < 4.0 && scrapedData.rating > 0) {
      chkTrustStatus = "failed";
      suggestions.push({
        title: currentLanguage === "zh" ? "信任评级：产品评级偏低" : "Trust Alert: Low Star Rating",
        desc: currentLanguage === "zh" ? `当前评分为 ${scrapedData.rating} 星。评级低于 4.0 星会导致转化率急速腰斩，高流失风险。` : `Product rating is ${scrapedData.rating} stars. Listings under 4.0 stars have high abandonment rates and conversion penalties.`,
        impact: "Critical",
        action: currentLanguage === "zh" ? "深度剖析 1-3 星差评，排查并改善产品物理性质量缺陷。" : "Investigate negative reviews for common quality defects."
      });
    } else if (scrapedData.rating < 4.5 && scrapedData.rating >= 4.0) {
      chkTrustStatus = "warning";
      suggestions.push({
        title: "信任优化：星级有提升空间",
        desc: currentLanguage === "zh" ? `产品评分为 ${scrapedData.rating}。优秀产品评级应大于 4.5，有助于提高黄金购物车比重及降低广告 ACoS。` : `Rating score is ${scrapedData.rating}. Target score >= 4.5 is ideal for winning buybox matches and PPC campaigns.`,
        impact: "Medium",
        action: currentLanguage === "zh" ? "通过后台 'Request a Review' 功能向近期高意向成交买家定向索评。" : "Incentivize positive feedback through 'Request a Review' inside seller central."
      });
    }

    if (scrapedData.reviewCount < 15 && scrapedData.reviewCount > 0) {
      chkTrustStatus = "warning";
      suggestions.push({
        title: currentLanguage === "zh" ? "信任指标：评论基数过于单薄" : "Trust Alert: Bare Reviews Volume",
        desc: currentLanguage === "zh" ? `目前仅有 ${scrapedData.reviewCount} 条评论。少于 15 条评价时，买家会因为缺乏购买社会认同而犹豫，跳失率极高。` : `Only ${scrapedData.reviewCount} customer reviews found. Buyers hesitate to trust product claims with under 15 validation reviews.`,
        impact: "Medium",
        action: currentLanguage === "zh" ? "利用 Amazon Vine 绿标测评计划迅速抓取前期好评反馈。" : "Utilize Amazon Vine reviewer platform to generate early ratings."
      });
    } else if (scrapedData.reviewCount === 0) {
      chkTrustStatus = "failed";
      suggestions.push({
        title: currentLanguage === "zh" ? "致命威胁：无任何买家评价" : "Trust Alert: Zero Customer Reviews",
        desc: currentLanguage === "zh" ? "Listing 评论数为 0。新品首要任务应集中资源破零，未起评产品几乎无法形成转化闭环。" : "Product has 0 reviews. Unreviewed products have extremely low conversion. Complete priorities to build ratings.",
        impact: "Critical",
        action: currentLanguage === "zh" ? "开启 Vine 测评，投放转化型广告，以及对首批老客户寄送赠礼邀评卡。" : "Activate Vine, launch review campaigns, and optimize product packaging."
      });
    }

    score = Math.min(100, Math.max(0, Math.round(score)));

    // Ensure state elements are visible
    showState("state-analyzed");

    // 6. Render Dashboard Gauges
    const scoreNumEl = document.getElementById("score-number");
    scoreNumEl.textContent = score;

    // SVG dashoffset calculation
    const radius = 42;
    const circumference = 2 * Math.PI * radius; // ~263.89
    const offset = circumference - (score / 100) * circumference;
    const ringBar = document.querySelector(".progress-ring-bar");
    ringBar.style.strokeDasharray = `${circumference} ${circumference}`;
    ringBar.style.strokeDashoffset = offset;

    // Apply gauge color
    let healthColor = "var(--color-success)";
    if (score < 50) healthColor = "var(--color-danger)";
    else if (score < 70) healthColor = "var(--color-warning)";
    ringBar.style.stroke = healthColor;
    scoreNumEl.style.color = healthColor;

    // 7. Render Grade Badge
    const gradeLetterEl = document.getElementById("grade-letter");
    const gradeTextEl = document.getElementById("grade-text");
    const gradeBadgeEl = document.getElementById("grade-badge");

    let grade = "A";
    let gradeText = currentLanguage === "zh" ? "优秀" : "Excellent";
    let gradeClass = "grade-a";

    if (score >= 80) {
      grade = "A"; gradeText = currentLanguage === "zh" ? "优秀" : "Excellent"; gradeClass = "grade-a";
    } else if (score >= 70) {
      grade = "B"; gradeText = currentLanguage === "zh" ? "良好" : "Good"; gradeClass = "grade-b";
    } else if (score >= 60) {
      grade = "C"; gradeText = currentLanguage === "zh" ? "中等" : "Fair"; gradeClass = "grade-c";
    } else if (score >= 50) {
      grade = "D"; gradeText = currentLanguage === "zh" ? "极差" : "Poor"; gradeClass = "grade-d";
    } else if (score >= 10) {
      grade = "E"; gradeText = currentLanguage === "zh" ? "严重不合规" : "Deficient"; gradeClass = "grade-e";
    } else {
      grade = "F"; gradeText = currentLanguage === "zh" ? "强行降权" : "Suppressed"; gradeClass = "grade-f";
    }

    gradeLetterEl.textContent = grade;
    gradeTextEl.textContent = gradeText;
    gradeBadgeEl.className = `grade-badge ${gradeClass}`;

    // 8. Render CDQ Compliance Ribbon
    const cdqRibbonEl = document.getElementById("cdq-ribbon");
    const cdqTextEl = document.getElementById("cdq-ribbon-text");
    
    cdqRibbonEl.classList.remove("hidden");
    if (cdqScore >= 80) {
      cdqRibbonEl.className = "cdq-ribbon passed";
      cdqTextEl.textContent = currentLanguage === "zh" ? `CDQ 指标：${cdqScore}% (Prime Day 秒杀活动达标 ✔)` : `CDQ Score: ${cdqScore}% (Prime Day Promotion Eligible ✔)`;
    } else if (cdqScore >= 60) {
      cdqRibbonEl.className = "cdq-ribbon warning";
      cdqTextEl.textContent = currentLanguage === "zh" ? `CDQ 警告：${cdqScore}% (大促秒杀受限风险 ⚠- 缺少规格)` : `CDQ Score: ${cdqScore}% (大促秒杀申报风险 ⚠- 补全Core黄金属性)`;
      suggestions.push({
        title: currentLanguage === "zh" ? "CDQ 警告：促销申报权限被卡" : "CDQ Warning: Promotion Enrollment Blocked",
        desc: currentLanguage === "zh" ? `当前 CDQ 数据完整度为 ${cdqScore}%。亚马逊对会员日、各类 BD、LD 申报有严苛的 CDQ 门槛限制，未满 80% 将被后台一键筛除。` : `Your CDQ Score is ${cdqScore}%. Amazon blocks Lightning Deals, Best Deals and Prime Day registrations for listings under 80% Composite Data Quality.`,
        impact: "Critical",
        action: currentLanguage === "zh" ? "立刻补齐上方的黄金 Core 缺失规格，破除促销申报限制。" : "Fill missing Golden Core fields immediately to unlock campaign eligibility."
      });
    } else {
      cdqRibbonEl.className = "cdq-ribbon failed";
      cdqTextEl.textContent = currentLanguage === "zh" ? `CDQ 危险：${cdqScore}% (ASIN 触发审核及降权风险 ✖)` : `CDQ Score: ${cdqScore}% (审核及降权风险 ✖- 严重缺属性)`;
      suggestions.push({
        title: currentLanguage === "zh" ? "CDQ 危险：低劣页面审核黄牌" : "CDQ Danger: Listing Audit Risk",
        desc: currentLanguage === "zh" ? `极低的 CDQ 得分（${cdqScore}%）。算法系统会对该 ASIN 判为低质量，削减自然搜索比重且存在被系统 Suppression 强制降架的隐患。` : `Extremely low CDQ Score of ${cdqScore}%. Amazon algorithms actively deprioritize listings with poor attribute compliance.`,
        impact: "Critical",
        action: currentLanguage === "zh" ? "立刻重构该 Listing 属性，将基础 5 要素及材质、尺寸全部填入系统。" : "Populate basic completeness attributes and golden specs to resolve search suppression risk."
      });
    }

    // 9. Render Quick Stats
    document.getElementById("market-detected").textContent = scrapedData.marketplace;
    document.getElementById("brand-detected").textContent = scrapedData.brand || "None";
    document.getElementById("brand-detected").title = scrapedData.brand || "No Brand String Found";

    // 10. Render Overview list items
    const overviewTitleText = currentLanguage === "zh" ? `标题字数：${scrapedData.title.length}字符。品牌先导：${titleStartsWithBrand ? "有" : "无"}` : `Title length is ${scrapedData.title.length} chars. Brand prefix: ${titleStartsWithBrand ? "Yes" : "No"}.`;
    const overviewImgText = currentLanguage === "zh" ? `主图纯白：${bgIsWhite ? "是" : "否"}。副图数：${scrapedData.images.length}张。Hover缩放：${actualWidth >= 1600 || actualHeight >= 1600 ? "是" : "否"}` : `Main image bg: ${bgIsWhite ? "White" : "Non-white"}. Count: ${scrapedData.images.length}. Zoom: ${actualWidth >= 1600 || actualHeight >= 1600 ? "Yes" : "No"}.`;
    const overviewDescText = currentLanguage === "zh" ? `详情描述：${scrapedData.hasDescription ? "有" : "无"}。A+ 富媒体内容：${scrapedData.hasAPlus ? "有" : "无"}` : `Description present: ${scrapedData.hasDescription ? "Yes" : "No"}. A+ Rich details: ${scrapedData.hasAPlus ? "Yes" : "No"}.`;
    const overviewSpecsText = currentLanguage === "zh" ? `CDQ 规格：已录入 ${scrapedData.specsCount} 行。面包屑节点分类：${scrapedData.hasLeafNode ? "是" : "否"}` : `Specs attributes: ${scrapedData.specsCount} filled parameters. Classify Node: ${scrapedData.hasLeafNode ? "Yes" : "No"}.`;
    const overviewTrustText = currentLanguage === "zh" ? `星级评分：${scrapedData.rating || "无"}★。评价总数：${scrapedData.reviewCount || "无"}条` : `Rating: ${scrapedData.rating || "No"} stars. Reviews: ${scrapedData.reviewCount || "No"} customer posts.`;

    updateOverviewItem("chk-title", chkTitleStatus, overviewTitleText);
    updateOverviewItem("chk-images", chkImagesStatus, overviewImgText);
    updateOverviewItem("chk-description", chkDescriptionStatus, overviewDescText);
    updateOverviewItem("chk-specs", chkSpecsStatus, overviewSpecsText);
    updateOverviewItem("chk-trust", chkTrustStatus, overviewTrustText);

    // 11. Render tab metrics details
    // Image metrics
    const imgPreview = document.getElementById("img-preview");
    const imgNoPreview = document.getElementById("img-no-preview");
    if (scrapedData.mainImage) {
      imgPreview.src = scrapedData.mainImage;
      imgPreview.classList.remove("hidden");
      imgNoPreview.classList.add("hidden");
    } else {
      imgPreview.classList.add("hidden");
      imgNoPreview.classList.remove("hidden");
    }

    const labelImgCountText = currentLanguage === "zh" ? "副图符合" : "images found";
    const labelZoomText = actualWidth >= 1600 || actualHeight >= 1600 ? (currentLanguage === "zh" ? "支持缩放" : "Zoom Enabled") : (currentLanguage === "zh" ? "无法缩放" : "No Zoom");
    const labelWhiteText = bgIsWhite ? (currentLanguage === "zh" ? "纯白背景" : "White Background") : (currentLanguage === "zh" ? "灰色/杂色" : "Gray/Colored");

    setMetricStatus("met-img-count", scrapedData.images.length, scrapedData.images.length >= 4 ? "pass" : "warn", `${scrapedData.images.length} ${labelImgCountText}`);
    setMetricStatus("met-img-zoom", actualWidth > 0 ? `${actualWidth}x${actualHeight}px` : "Unknown", actualWidth >= 1600 || actualHeight >= 1600 ? "pass" : "warn", labelZoomText);
    setMetricStatus("met-img-bg", bgIsWhite ? (currentLanguage === "zh" ? "纯白" : "Pure White") : (currentLanguage === "zh" ? "不合规" : "Non-White"), bgIsWhite ? "pass" : "warn", labelWhiteText);

    // Content metrics
    const labelTitleMobileText = scrapedData.title.length > 80 ? (currentLanguage === "zh" ? "偏长 (移动端裁切)" : "Long (Trimmed on Mobile)") : (currentLanguage === "zh" ? "完美" : "Standard");
    const labelTitleBrandText = titleStartsWithBrand ? (currentLanguage === "zh" ? "以品牌开头" : "Starts with Brand") : (currentLanguage === "zh" ? "缺少前缀" : "Missing Prefix");
    const labelTitleRepText = hasRepeatedWords ? (currentLanguage === "zh" ? "字词堆砌违规" : "Violation") : (currentLanguage === "zh" ? "正常" : "Clean");
    const labelBulletsCountText = currentLanguage === "zh" ? "点描述" : "points";

    setMetricStatus("met-title-length", `${scrapedData.title.length} 字符`, titleLengthOk ? "pass" : "warn", labelTitleMobileText);
    setMetricStatus("met-title-brand", titleStartsWithBrand ? "Starts" : "Missing", titleStartsWithBrand ? "pass" : "warn", labelTitleBrandText);
    setMetricStatus("met-title-repetition", hasRepeatedWords ? "Violation" : "Clean", hasRepeatedWords ? "fail" : "pass", labelTitleRepText);
    setMetricStatus("met-bullets-count", `${scrapedData.bulletPoints.length} ${labelBulletsCountText}`, scrapedData.bulletPoints.length >= 5 ? "pass" : (scrapedData.bulletPoints.length >= 3 ? "warn" : "fail"));
    setMetricStatus("met-has-description", scrapedData.hasDescription ? (currentLanguage === "zh" ? "已填写" : "Yes") : (currentLanguage === "zh" ? "缺失" : "Missing"), scrapedData.hasDescription ? "pass" : "fail");
    setMetricStatus("met-has-aplus", scrapedData.hasAPlus ? (currentLanguage === "zh" ? "已激活" : "Activated") : (currentLanguage === "zh" ? "无A+" : "Not Found"), scrapedData.hasAPlus ? "pass" : "warn");

    // Specs metrics
    const labelSpecsCountText = currentLanguage === "zh" ? "个已填参数" : "filled";
    const labelRatingText = scrapedData.rating > 0 ? `${scrapedData.rating} ★` : "None";
    const labelRatingStatusText = scrapedData.rating >= 4.0 ? "pass" : (scrapedData.rating > 0 ? "fail" : "warn");
    const labelReviewsCountText = scrapedData.reviewCount > 0 ? (currentLanguage === "zh" ? `${scrapedData.reviewCount} 条评价` : `${scrapedData.reviewCount} ratings`) : (currentLanguage === "zh" ? "无评价" : "0 reviews");

    setMetricStatus("met-leaf-node", scrapedData.hasLeafNode ? (currentLanguage === "zh" ? "已绑定" : "Classified") : (currentLanguage === "zh" ? "未绑定" : "Not Found"), scrapedData.hasLeafNode ? "pass" : "fail");
    setMetricStatus("met-specs-count", `${scrapedData.specsCount} ${labelSpecsCountText}`, scrapedData.specsCount >= 6 ? "pass" : (scrapedData.specsCount >= 3 ? "warn" : "fail"));
    setMetricStatus("met-rating", labelRatingText, labelRatingStatusText);
    setMetricStatus("met-reviews", labelReviewsCountText, scrapedData.reviewCount >= 15 ? "pass" : (scrapedData.reviewCount > 0 ? "warn" : "fail"));

    // 12. Render Suggestions list
    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = "";
    document.getElementById("suggestion-count").textContent = suggestions.length;

    if (suggestions.length === 0) {
      suggestionsList.innerHTML = `
        <div class="msg-box info" style="margin: 20px 0;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h4 style="margin-top: 5px;">${currentLanguage === "zh" ? "页面极其完美！" : "Perfect Listing Quality!"}</h4>
          <p>${currentLanguage === "zh" ? "检测通过：您的 Listing 完全符合亚马逊最新打分标准的全部合规细节。" : "Your listing matches all key parameters in Amazon's official quality score checklist."}</p>
        </div>
      `;
    } else {
      // Sort suggestions so Critical comes first
      const order = { "Critical": 1, "Medium": 2, "Info": 3 };
      suggestions.sort((a, b) => order[a.impact] - order[b.impact]);

      suggestions.forEach(sug => {
        const levelClass = sug.impact === "Critical" ? "level-critical" : (sug.impact === "Medium" ? "level-warn" : "level-info");
        const levelText = sug.impact === "Critical" ? (currentLanguage === "zh" ? "致命限制" : "Critical") : (sug.impact === "Medium" ? (currentLanguage === "zh" ? "关键漏洞" : "Medium") : (currentLanguage === "zh" ? "改进建议" : "Info"));
        
        const card = document.createElement("div");
        card.className = `suggestion-card ${levelClass}`;
        card.innerHTML = `
          <div class="sugg-header">
            <span class="sugg-title">${escapeHtml(sug.title)}</span>
            <span class="sugg-impact">${levelText}</span>
          </div>
          <p class="sugg-desc">${escapeHtml(sug.desc)}</p>
          <div class="sugg-action">${escapeHtml(sug.action)}</div>
        `;
        suggestionsList.appendChild(card);
      });
    }
  }

  function detectCategory(scrapedData) {
    const text = (scrapedData.title + " " + scrapedData.url).toLowerCase();
    const electronicsKeywords = [
      "phone", "case", "electronics", "headphone", "earbud", "charger", "cable", "camera", "adapter", 
      "laptop", "mouse", "keyboard", "monitor", "speaker", "battery", "plug", "wifi", "router", "spec",
      "usb", "ipad", "iphone", "samsung", "android", "lens", "audio", "video", "sensor"
    ];
    
    const isElectronics = electronicsKeywords.some(kw => text.includes(kw)) || scrapedData.specsCount > 10;
    return isElectronics ? "electronics" : "standard";
  }

  function getTitleWordRepetitions(title) {
    if (!title) return [];
    
    const stopWords = new Set([
      "in", "on", "at", "to", "by", "for", "with", "from", "of", "about", "into", "over", "under", "above", "below",
      "the", "a", "an", "this", "that", "these", "those",
      "and", "but", "or", "nor", "for", "yet", "so",
      "is", "are", "was", "were", "be", "been", "being", "has", "have", "had", "do", "does", "did",
      "with", "without", "within", "of", "off", "to", "up", "down", "out", "new"
    ]);

    // Clean title, strip punctuation, split to words
    const words = title.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'+]/g, " ")
      .split(/\s+/);

    const counts = {};
    words.forEach(word => {
      if (!word || word.length <= 1 || stopWords.has(word)) return;
      
      // Simple plural normalizations
      let normalized = word;
      if (word.endsWith("ies") && word.length > 4) {
        normalized = word.slice(0, -3) + "y";
      } else if (word.endsWith("es") && word.length > 3) {
        normalized = word.slice(0, -2);
      } else if (word.endsWith("s") && !word.endsWith("ss") && word.length > 2) {
        normalized = word.slice(0, -1);
      }

      counts[normalized] = (counts[normalized] || 0) + 1;
    });

    const list = Object.keys(counts).map(word => ({ word, count: counts[word] }));
    return list;
  }

  // Pure White Background Checking via local Blob Canvas (Enhanced CORS failover)
  async function checkImageBackground(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const w = img.naturalWidth;
          const h = img.naturalHeight;

          if (w < 50 || h < 50) {
            resolve({ isWhite: false, width: w, height: h });
            return;
          }

          const insetX = Math.round(w * 0.02);
          const insetY = Math.round(h * 0.02);

          const corners = [
            ctx.getImageData(insetX, insetY, 1, 1).data,
            ctx.getImageData(w - insetX - 1, insetY, 1, 1).data,
            ctx.getImageData(insetX, h - insetY - 1, 1, 1).data,
            ctx.getImageData(w - insetX - 1, h - insetY - 1, 1, 1).data,
            ctx.getImageData(Math.round(w / 2), insetY, 1, 1).data,
            ctx.getImageData(insetX, Math.round(h / 2), 1, 1).data,
            ctx.getImageData(w - insetX - 1, Math.round(h / 2), 1, 1).data,
            ctx.getImageData(Math.round(w / 2), h - insetY - 1, 1, 1).data
          ];

          const whiteThreshold = 253;
          let whiteMatches = 0;

          corners.forEach(([r, g, b]) => {
            if (r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold) {
              whiteMatches++;
            }
          });

          const isWhite = whiteMatches >= 6;
          resolve({ isWhite, width: w, height: h });
        } catch (e) {
          resolve({ isWhite: !imageUrl.includes("gray") && !imageUrl.includes("no-image"), width: img.naturalWidth, height: img.naturalHeight });
        }
      };

      img.onerror = () => {
        fetchBlobAsObjectUrl(imageUrl).then(objectUrl => {
          if (!objectUrl) {
            resolve({ isWhite: false, width: 0, height: 0 });
            return;
          }
          const blobImg = new Image();
          blobImg.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = blobImg.naturalWidth;
              canvas.height = blobImg.naturalHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(blobImg, 0, 0);

              const w = blobImg.naturalWidth;
              const h = blobImg.naturalHeight;

              const insetX = Math.round(w * 0.02);
              const insetY = Math.round(h * 0.02);

              const corners = [
                ctx.getImageData(insetX, insetY, 1, 1).data,
                ctx.getImageData(w - insetX - 1, insetY, 1, 1).data,
                ctx.getImageData(insetX, h - insetY - 1, 1, 1).data,
                ctx.getImageData(w - insetX - 1, h - insetY - 1, 1, 1).data,
                ctx.getImageData(Math.round(w / 2), insetY, 1, 1).data,
                ctx.getImageData(insetX, Math.round(h / 2), 1, 1).data
              ];

              URL.revokeObjectURL(objectUrl);

              let whiteMatches = 0;
              corners.forEach(([r, g, b]) => {
                if (r >= 253 && g >= 253 && b >= 253) whiteMatches++;
              });

              resolve({ isWhite: whiteMatches >= 4, width: w, height: h });
            } catch (err) {
              URL.revokeObjectURL(objectUrl);
              resolve({ isWhite: true, width: blobImg.naturalWidth, height: blobImg.naturalHeight });
            }
          };
          blobImg.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve({ isWhite: false, width: 0, height: 0 });
          };
          blobImg.src = objectUrl;
        }).catch(() => {
          resolve({ isWhite: false, width: 0, height: 0 });
        });
      };

      img.src = imageUrl;
    });
  }

  async function fetchBlobAsObjectUrl(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Failed to fetch image blob cross-origin", e);
      return null;
    }
  }

  // UI state switcher helper
  function showState(stateId) {
    document.getElementById("state-not-amazon").classList.add("hidden");
    document.getElementById("state-scanning").classList.add("hidden");
    document.getElementById("state-analyzed").classList.add("hidden");

    document.getElementById(stateId).classList.remove("hidden");
  }

  function updateOverviewItem(elementId, status, description) {
    const el = document.getElementById(elementId);
    el.className = `overview-item ${status}`;
    el.querySelector("p").textContent = description;
  }

  function setMetricStatus(elementId, valueText, status, statusText = "") {
    const el = document.getElementById(elementId);
    el.innerHTML = `${valueText} <span class="metric-status status-${status}">${statusText || status.toUpperCase()}</span>`;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
