// Amazon Listing Health Analyzer - Content Script (Enhanced with CDQ Attributes & Master High-Res Images)

// Clean resized Amazon CDN URLs to fetch the original master asset URL
function getMasterImageUrl(url) {
  if (!url) return "";
  // Strip Amazon sizing tokens (e.g. ._AC_SX679_ or ._AC_US40_) before the file extension
  return url.replace(/\._[A-Za-z0-9_-]+_\.(jpg|jpeg|png|gif|webp)/i, ".$1");
}

// Clean brand name string from conversational text patterns
function cleanBrandName(rawBrand) {
  if (!rawBrand) return "";
  let brand = rawBrand.trim();

  // Pattern 1: "Visit the [Brand] Store" or "Visit [Brand] Store"
  const visitStoreMatch = brand.match(/Visit\s+(?:the\s+)?(.+?)\s+Store/i);
  if (visitStoreMatch) {
    return visitStoreMatch[1].trim();
  }

  // Pattern 2: "访问 [Brand] 的亚马逊店铺" or "访问 [Brand] 店铺"
  const cnVisitMatch = brand.match(/访问\s+(.+?)\s*(?:的亚马逊店铺|的店铺|店铺)/);
  if (cnVisitMatch) {
    return cnVisitMatch[1].trim();
  }

  // Pattern 3: "Brand: [Brand]" or "品牌: [Brand]" or "ブランド: [Brand]"
  const colonMatch = brand.match(/^(?:Brand|品牌|ブランド|Hersteller|Marque|Marca)\s*:\s*(.+)/i);
  if (colonMatch) {
    return colonMatch[1].trim();
  }

  // Pattern 4: "[Brand] Store" or "[Brand]店铺"
  const storeEndMatch = brand.match(/^(.+?)\s*(?:Store|店铺|ストア)$/i);
  if (storeEndMatch) {
    return storeEndMatch[1].trim();
  }

  return brand;
}

function extractListingData() {
  const data = {
    title: "",
    brand: "",
    bulletPoints: [],
    descriptionText: "",
    hasDescription: false,
    hasAPlus: false,
    images: [],
    mainImage: "",
    mainImageResolution: { width: 0, height: 0 },
    rating: 0,
    reviewCount: 0,
    hasLeafNode: false,
    specsCount: 0,
    specsMap: {}, // Hold key-value specs for CDQ checks
    url: window.location.href,
    marketplace: window.location.hostname
  };

  try {
    // 1. Extract Title
    const titleEl = document.querySelector("#productTitle");
    if (titleEl) {
      data.title = titleEl.textContent.trim();
    }

    // 2. Extract Brand
    const brandEl = document.querySelector("#bylineInfo") || 
                    document.querySelector("#brand") || 
                    document.querySelector("#bylineInfo_feature_div") ||
                    document.querySelector(".hr-mkt-brand-link");
    if (brandEl) {
      data.brand = cleanBrandName(brandEl.textContent.trim());
    }

    // 3. Extract Bullet Points
    const bulletEls = document.querySelectorAll("#feature-bullets ul li:not(.a-hidden) span.a-list-item");
    bulletEls.forEach(el => {
      const text = el.textContent.trim();
      if (text && !text.includes("Make sure this fits")) {
        data.bulletPoints.push(text);
      }
    });

    // 4. Extract Product Description & A+ Content
    const descEl = document.querySelector("#productDescription") || 
                   document.querySelector("#productDescription_feature_div");
    if (descEl) {
      data.descriptionText = descEl.textContent.trim();
      data.hasDescription = data.descriptionText.length > 0;
    } else {
      data.hasDescription = false;
    }

    const aplusEl = document.querySelector("#aplus") || 
                    document.querySelector("#aplus_feature_div") || 
                    document.querySelector("div[data-feature-name='aplus']");
    if (aplusEl) {
      data.hasAPlus = true;
    }

    // 5. Extract Main Image (Master high resolution version)
    const mainImgEl = document.querySelector("#landingImage") || 
                      document.querySelector("#imgBlkFront") || 
                      document.querySelector("#main-image") || 
                      document.querySelector("#ebooksImgBlk") ||
                      document.querySelector("#imgTagWrapperId img");
    
    if (mainImgEl) {
      const srcUrl = mainImgEl.getAttribute("src") || "";
      data.mainImage = getMasterImageUrl(srcUrl);
      
      const oldHires = mainImgEl.getAttribute("data-old-hires");
      if (oldHires) {
        data.mainImage = getMasterImageUrl(oldHires);
      }

      // Parse data-a-dynamic-image if available to extract raw dimension clues
      const dynamicImagesStr = mainImgEl.getAttribute("data-a-dynamic-image");
      if (dynamicImagesStr) {
        try {
          const dynamicImages = JSON.parse(dynamicImagesStr);
          const urls = Object.keys(dynamicImages);
          if (urls.length > 0) {
            let maxDim = 0;
            let bestUrl = data.mainImage;
            urls.forEach(url => {
              const dims = dynamicImages[url];
              if (Array.isArray(dims) && dims.length === 2) {
                const area = dims[0] * dims[1];
                if (area > maxDim) {
                  maxDim = area;
                  bestUrl = getMasterImageUrl(url);
                  data.mainImageResolution = { width: dims[0], height: dims[1] };
                }
              }
            });
            data.mainImage = bestUrl;
          }
        } catch (e) {
          console.error("Error parsing data-a-dynamic-image", e);
        }
      }
    }

    // Compile thumbnails
    const thumbContainerEls = document.querySelectorAll("#altImages ul li img, .altImage img, #imageBlockThumbs img, #main-image-container img");
    const uniqueImages = new Set();
    if (data.mainImage) uniqueImages.add(data.mainImage);
    
    thumbContainerEls.forEach(img => {
      let src = img.getAttribute("src");
      if (src) {
        uniqueImages.add(getMasterImageUrl(src));
      }
    });
    data.images = Array.from(uniqueImages);

    // 6. Extract Ratings & Review count
    const ratingEl = document.querySelector("#acrPopover") || 
                     document.querySelector("#averageCustomerReviews") ||
                     document.querySelector(".a-star-4-5") || 
                     document.querySelector(".a-star-4") || 
                     document.querySelector(".a-star-5");
    if (ratingEl) {
      const titleAttr = ratingEl.getAttribute("title");
      if (titleAttr) {
        const ratingMatch = titleAttr.match(/([0-9.]+)\s*(out of|分)/i);
        if (ratingMatch) {
          data.rating = parseFloat(ratingMatch[1]);
        }
      } else {
        const text = ratingEl.textContent.trim();
        const ratingMatch = text.match(/([0-9.]+)\s*(out of|分)/i);
        if (ratingMatch) {
          data.rating = parseFloat(ratingMatch[1]);
        }
      }
    }
    if (data.rating === 0) {
      const textEl = document.querySelector("span.a-icon-alt") || document.querySelector("#acrPopover span.a-size-base.a-color-base");
      if (textEl) {
        const match = textEl.textContent.trim().match(/([0-9.]+)/);
        if (match) {
          const val = parseFloat(match[1]);
          if (val <= 5) data.rating = val;
        }
      }
    }

    const reviewTextEl = document.querySelector("#acrCustomerReviewText");
    if (reviewTextEl) {
      const cleanText = reviewTextEl.textContent.trim().replace(/[\s,\u00A0]/g, "");
      const match = cleanText.match(/([0-9]+)/);
      if (match) {
        data.reviewCount = parseInt(match[1], 10);
      }
    }

    // 7. Category Leaf Node (Breadcrumbs)
    const breadcrumbEl = document.querySelector("#wayfinding-breadcrumbs_feature_div") || 
                         document.querySelector("#wayfinding-breadcrumbs_container") ||
                         document.querySelector(".a-breadcrumb");
    if (breadcrumbEl && breadcrumbEl.textContent.trim().length > 0) {
      data.hasLeafNode = true;
    }

    // 8. Specifications Map & Rows (For CDQ Verification)
    const specContainer = document.querySelector("#prodDetails") || 
                          document.querySelector("#detailBullets_feature_div") || 
                          document.querySelector("#technicalSpecifications_section_1") || 
                          document.querySelector("#productDetails_techSpec_section_1") || 
                          document.querySelector("#productDetails_db_sections") ||
                          document.querySelector(".a-keyvalue");
    if (specContainer) {
      const rows = specContainer.querySelectorAll("tr, li, .vtp-product-details-specs-row");
      data.specsCount = rows.length;

      // Extract specific key-value pairs for deep CDQ analysis
      rows.forEach(row => {
        const keyEl = row.querySelector("td.label, th, span.a-list-item strong, .vtp-product-details-specs-row-label");
        const valEl = row.querySelector("td.value, td:not(.label), span.a-list-item span, .vtp-product-details-specs-row-value");
        if (keyEl && valEl) {
          const key = keyEl.textContent.trim().toLowerCase().replace(/[:\s]+/g, " ");
          const val = valEl.textContent.trim();
          if (key && val) {
            data.specsMap[key] = val;
          }
        }
      });
    }

  } catch (err) {
    console.error("Error in Amazon Listing Analyzer CDQ extraction:", err);
  }

  return data;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanListing") {
    const scrapedData = extractListingData();
    sendResponse({ success: true, data: scrapedData });
  }
  return true;
});
