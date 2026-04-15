import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/product";
import CommonTypes "../types/common";

module {
  public type ProductInternal = Types.ProductInternal;
  public type Product         = Types.Product;
  public type CreateProductInput = Types.CreateProductInput;
  public type UpdateProductInput = Types.UpdateProductInput;
  public type ProductFilter   = Types.ProductFilter;
  public type Category        = Types.Category;
  public type LowStockAlert   = Types.LowStockAlert;

  // ── Conversion ─────────────────────────────────────────────────────────────

  public func toPublic(self : ProductInternal) : Product {
    {
      id             = self.id;
      title          = self.title;
      description    = self.description;
      price          = self.price;
      compareAtPrice = self.compareAtPrice;
      images         = self.images;
      stock          = self.stock;
      sku            = self.sku;
      categoryId     = self.categoryId;
      subcategoryId  = self.subcategoryId;
      tags           = self.tags;
      isActive       = self.isActive;
      reorderPoint   = self.reorderPoint;
      soldCount      = self.soldCount;
      createdAt      = self.createdAt;
      updatedAt      = self.updatedAt;
    };
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────

  public func create(
    products : List.List<ProductInternal>,
    nextId   : Nat,
    input    : CreateProductInput,
  ) : ProductInternal {
    let now = Time.now();
    let p : ProductInternal = {
      id             = nextId;
      var title          = input.title;
      var description    = input.description;
      var price          = input.price;
      var compareAtPrice = input.compareAtPrice;
      var images         = input.images;
      var stock          = input.stock;
      var sku            = input.sku;
      var categoryId     = input.categoryId;
      var subcategoryId  = input.subcategoryId;
      var tags           = input.tags;
      var isActive       = input.isActive;
      var reorderPoint   = input.reorderPoint;
      var soldCount      = 0;
      createdAt          = now;
      var updatedAt      = now;
    };
    products.add(p);
    p;
  };

  public func update(self : ProductInternal, input : UpdateProductInput) : () {
    let now = Time.now();
    switch (input.title)          { case (?v) { self.title          := v }; case null {} };
    switch (input.description)    { case (?v) { self.description    := v }; case null {} };
    switch (input.price)          { case (?v) { self.price          := v }; case null {} };
    switch (input.compareAtPrice) { case (?v) { self.compareAtPrice := ?v }; case null {} };
    switch (input.images)         { case (?v) { self.images         := v }; case null {} };
    switch (input.stock)          { case (?v) { self.stock          := v }; case null {} };
    switch (input.sku)            { case (?v) { self.sku            := v }; case null {} };
    switch (input.categoryId)     { case (?v) { self.categoryId     := v }; case null {} };
    switch (input.subcategoryId)  { case (?v) { self.subcategoryId  := ?v }; case null {} };
    switch (input.tags)           { case (?v) { self.tags           := v }; case null {} };
    switch (input.isActive)       { case (?v) { self.isActive       := v }; case null {} };
    switch (input.reorderPoint)   { case (?v) { self.reorderPoint   := v }; case null {} };
    self.updatedAt := now;
  };

  public func adjustStock(self : ProductInternal, delta : Int) : () {
    let current = self.stock.toInt();
    let next    = current + delta;
    self.stock    := if (next <= 0) 0 else next.toNat();
    self.updatedAt := Time.now();
  };

  // ── Queries ────────────────────────────────────────────────────────────────

  public func getById(
    products : List.List<ProductInternal>,
    id       : CommonTypes.ProductId,
  ) : ?ProductInternal {
    products.find(func(p) { p.id == id });
  };

  func matchesFilter(p : ProductInternal, f : ProductFilter) : Bool {
    if (f.inStockOnly and p.stock == 0) return false;
    switch (f.isActive)       { case (?v) { if (p.isActive != v) return false };      case null {} };
    switch (f.categoryId)     { case (?v) { if (p.categoryId != v) return false };    case null {} };
    switch (f.subcategoryId)  {
      case (?v) {
        switch (p.subcategoryId) {
          case (?ps) { if (ps != v) return false };
          case null  { return false };
        };
      };
      case null {};
    };
    switch (f.minPrice) { case (?v) { if (p.price < v) return false }; case null {} };
    switch (f.maxPrice) { case (?v) { if (p.price > v) return false }; case null {} };
    switch (f.searchTerm) {
      case (?term) {
        let lo = term.toLower();
        if (not p.title.toLower().contains(#text lo) and
            not p.description.toLower().contains(#text lo)) return false;
      };
      case null {};
    };
    if (f.tags.size() > 0) {
      // at least one tag must match
      if (f.tags.find(func(tag) { p.tags.find(func(t) { t == tag }) != null }) == null) return false;
    };
    true;
  };

  public func list(
    products : List.List<ProductInternal>,
    filter   : ProductFilter,
    offset   : Nat,
    limit    : Nat,
  ) : [Product] {
    let filtered = products.filter(func(p) { matchesFilter(p, filter) });
    let total    = filtered.size();
    if (offset >= total) return [];
    let endIdx = if (offset + limit > total) total else offset + limit;
    filtered.sliceToArray(offset.toInt(), endIdx.toInt()).map<ProductInternal, Product>(toPublic);
  };

  public func getLowStockAlerts(products : List.List<ProductInternal>) : [LowStockAlert] {
    products.filter(func(p) { p.stock <= p.reorderPoint })
            .toArray()
            .map<ProductInternal, LowStockAlert>(func(p) {
              { productId = p.id; title = p.title; stock = p.stock; reorderPoint = p.reorderPoint };
            });
  };

  public func search(
    products : List.List<ProductInternal>,
    term     : Text,
    limit    : Nat,
  ) : [Product] {
    let lo      = term.toLower();
    let matched = products.filter(func(p) {
      p.isActive and (
        p.title.toLower().contains(#text lo) or
        p.description.toLower().contains(#text lo)
      )
    });
    let arr = matched.toArray();
    let endIdx = if (limit > arr.size()) arr.size() else limit;
    arr.sliceToArray(0, endIdx.toInt()).map<ProductInternal, Product>(toPublic);
  };

  public func bulkUpdateActive(
    products : List.List<ProductInternal>,
    ids      : [CommonTypes.ProductId],
    isActive : Bool,
  ) : Nat {
    var count = 0;
    let now   = Time.now();
    products.mapInPlace(func(p) {
      if (ids.find(func(id) { id == p.id }) != null) {
        count += 1;
        p.isActive  := isActive;
        p.updatedAt := now;
      };
      p;
    });
    count;
  };

  // ── Seed data ──────────────────────────────────────────────────────────────

  public func seedCategories() : [Category] {
    [
      {
        id = 1;
        name = "Electronics & Gadgets";
        slug = "electronics-gadgets";
        subcategories = [
          { id = 11; name = "Phones & Tablets"; slug = "phones-tablets"    },
          { id = 12; name = "Computers";        slug = "computers"          },
          { id = 13; name = "Audio";            slug = "audio"              },
          { id = 14; name = "Smart Home";       slug = "smart-home"         },
          { id = 15; name = "Accessories";      slug = "accessories-elec"   },
        ];
      },
      {
        id = 2;
        name = "Fashion & Apparel";
        slug = "fashion-apparel";
        subcategories = [
          { id = 21; name = "Men";         slug = "men"               },
          { id = 22; name = "Women";       slug = "women"             },
          { id = 23; name = "Kids";        slug = "kids"              },
          { id = 24; name = "Shoes";       slug = "shoes"             },
          { id = 25; name = "Accessories"; slug = "accessories-fash"  },
        ];
      },
    ];
  };

  public func seedProducts(_categories : [Category], nextId : Nat) : [ProductInternal] {
    let now = Time.now();
    var id  = nextId;

    func mk(
      catId    : Nat,
      subId    : ?Nat,
      title    : Text,
      desc     : Text,
      price    : Float,
      cmpPrice : ?Float,
      stock    : Nat,
      sku      : Text,
      imgs     : [Text],
      tags     : [Text],
      reorder  : Nat,
    ) : ProductInternal {
      let p : ProductInternal = {
        id             = id;
        var title          = title;
        var description    = desc;
        var price          = price;
        var compareAtPrice = cmpPrice;
        var images         = imgs;
        var stock          = stock;
        var sku            = sku;
        var categoryId     = catId;
        var subcategoryId  = subId;
        var tags           = tags;
        var isActive       = true;
        var reorderPoint   = reorder;
        var soldCount      = 0;
        createdAt          = now;
        var updatedAt      = now;
      };
      id += 1;
      p;
    };

    // ── Electronics & Gadgets ─────────────────────────────────────────────

    let p1 = mk(1, ?11, "ProPhone X15 Smartphone",
      "6.7-inch AMOLED display, 200MP triple camera, 5000mAh battery, 5G ready. The ultimate smartphone experience.",
      699.99, ?899.99, 85, "PPX15-BLK",
      ["https://picsum.photos/seed/phone1/600/600", "https://picsum.photos/seed/phone1b/600/600"],
      ["smartphone", "5g", "android", "camera"], 15);

    let p2 = mk(1, ?11, "TabView Pro 11\" Tablet",
      "11-inch IPS display, 8GB RAM, 256GB storage, USB-C charging. Ideal for work and entertainment.",
      449.99, ?549.99, 42, "TVP11-SLV",
      ["https://picsum.photos/seed/tablet1/600/600", "https://picsum.photos/seed/tablet1b/600/600"],
      ["tablet", "android", "productivity"], 10);

    let p3 = mk(1, ?13, "BudPod Pro Wireless Earbuds",
      "True wireless earbuds with ANC, 30h total battery, IPX5 waterproof, and custom EQ via app.",
      89.99, ?129.99, 120, "BPP-WHT",
      ["https://picsum.photos/seed/earbuds1/600/600", "https://picsum.photos/seed/earbuds1b/600/600"],
      ["earbuds", "wireless", "anc", "audio"], 20);

    let p4 = mk(1, ?12, "UltraBook Slim 14",
      "Intel Core i7, 16GB RAM, 512GB NVMe SSD, 14-inch FHD IPS. Just 1.2kg — power without the weight.",
      1099.99, ?1299.99, 30, "UBS14-SLV",
      ["https://picsum.photos/seed/laptop1/600/600", "https://picsum.photos/seed/laptop1b/600/600"],
      ["laptop", "ultrabook", "intel", "work"], 8);

    let p5 = mk(1, ?12, "DeskPower RTX Gaming PC",
      "AMD Ryzen 9 7950X, RTX 4070, 32GB DDR5, 2TB NVMe. Dominate every title at ultra settings.",
      1499.99, null, 18, "DPRTX-BLK",
      ["https://picsum.photos/seed/pc1/600/600", "https://picsum.photos/seed/pc1b/600/600"],
      ["desktop", "gaming", "rtx", "amd"], 5);

    let p6 = mk(1, ?15, "MechaKeys RGB Keyboard",
      "Tenkeyless mechanical keyboard with Cherry MX Red switches, per-key RGB, and aluminum top plate.",
      79.99, ?99.99, 200, "MKR-BLK",
      ["https://picsum.photos/seed/keyboard1/600/600"],
      ["keyboard", "mechanical", "rgb", "gaming"], 30);

    let p7 = mk(1, ?13, "SoundWave Studio Headphones",
      "Reference over-ear headphones with 40mm planar drivers, 32 ohm, detachable cable. Audiophile-grade sound.",
      149.99, ?199.99, 65, "SWS-BLK",
      ["https://picsum.photos/seed/headphones1/600/600", "https://picsum.photos/seed/headphones1b/600/600"],
      ["headphones", "studio", "audiophile", "mixing"], 12);

    let p8 = mk(1, ?13, "BoomBox Mini Bluetooth Speaker",
      "360-degree sound, 20W output, 12h battery, waterproof IPX7. Stereo-pair two for room-filling audio.",
      59.99, ?79.99, 150, "BBM-RED",
      ["https://picsum.photos/seed/speaker1/600/600"],
      ["speaker", "bluetooth", "portable", "waterproof"], 25);

    let p9 = mk(1, ?14, "SmartHub 4K Security Camera",
      "Outdoor 4K camera with night vision, two-way audio, AI person detection, and local storage.",
      129.99, ?159.99, 75, "SH4K-WHT",
      ["https://picsum.photos/seed/camera1/600/600"],
      ["security", "camera", "smarthome", "4k"], 15);

    let p10 = mk(1, ?14, "LumiGlow Smart LED Strip 5m",
      "RGBW LED strip, app + voice control, music sync, 16M colors. Easy peel-and-stick install.",
      34.99, ?49.99, 300, "LGS5M-RGB",
      ["https://picsum.photos/seed/led1/600/600"],
      ["led", "smarthome", "lighting", "rgb"], 50);

    let p11 = mk(1, ?15, "EchoPlug Smart Power Socket",
      "Wi-Fi smart plug with real-time energy monitoring, schedule timers, and overload protection.",
      19.99, ?24.99, 400, "EPS-WHT",
      ["https://picsum.photos/seed/plug1/600/600"],
      ["smarthome", "plug", "energy", "wifi"], 60);

    let p12 = mk(1, ?15, "Portable Power Bank 20000mAh",
      "Dual USB-A + USB-C, 65W PD fast charge, LED indicator, airline-approved. Never run out of power.",
      44.99, ?59.99, 180, "PPB20K-BLK",
      ["https://picsum.photos/seed/powerbank1/600/600"],
      ["powerbank", "charger", "portable", "usb-c"], 30);

    // ── Fashion & Apparel ──────────────────────────────────────────────────

    let p13 = mk(2, ?21, "UrbanFit Slim Chinos",
      "Stretch cotton slim-fit chinos with a clean modern silhouette. Wrinkle-resistant, desk-to-dinner ready.",
      49.99, ?69.99, 180, "UFC-KHK-32",
      ["https://picsum.photos/seed/chinos1/600/600", "https://picsum.photos/seed/chinos1b/600/600"],
      ["men", "pants", "chinos", "slim"], 30);

    let p14 = mk(2, ?21, "StreetEdge Graphic Hoodie",
      "400gsm heavyweight fleece with bold chest print. Dropped shoulders, oversized fit, kangaroo pocket.",
      44.99, null, 140, "SEG-BLK-M",
      ["https://picsum.photos/seed/hoodie1/600/600"],
      ["men", "hoodie", "streetwear", "oversized"], 25);

    let p15 = mk(2, ?21, "Alpine 3-in-1 Trekking Jacket",
      "Waterproof hardshell with removable fleece liner, taped seams, underarm vents, and hood.",
      119.99, ?149.99, 60, "ATJ-NVY-L",
      ["https://picsum.photos/seed/jacket1/600/600", "https://picsum.photos/seed/jacket1b/600/600"],
      ["men", "jacket", "outdoor", "waterproof"], 10);

    let p16 = mk(2, ?22, "FlowDress Midi Wrap",
      "Viscose wrap dress with bold floral print and adjustable tie waist. Packable, effortlessly elegant.",
      54.99, ?74.99, 110, "FDM-FLR-S",
      ["https://picsum.photos/seed/dress1/600/600", "https://picsum.photos/seed/dress1b/600/600"],
      ["women", "dress", "midi", "floral"], 20);

    let p17 = mk(2, ?22, "SoftKnit Ribbed Turtleneck",
      "Viscose-blend ribbed turtleneck with relaxed silhouette and cropped length. A wardrobe staple.",
      39.99, ?54.99, 200, "SKR-CRM-M",
      ["https://picsum.photos/seed/turtleneck1/600/600"],
      ["women", "top", "knitwear", "casual"], 35);

    let p18 = mk(2, ?22, "PowerStretch High-Waist Leggings",
      "4-way stretch, squat-proof, moisture-wicking. Built-in waistband pocket. Gym to street.",
      34.99, ?44.99, 250, "PSY-BLK-S",
      ["https://picsum.photos/seed/leggings1/600/600"],
      ["women", "activewear", "yoga", "leggings"], 40);

    let p19 = mk(2, ?23, "KidBright Dino Hoodie",
      "400gsm fleece zip-up hoodie with embroidered dino patch. Machine-washable, grown-up quality.",
      24.99, ?34.99, 160, "KBD-GRN-6Y",
      ["https://picsum.photos/seed/kidshoodie1/600/600"],
      ["kids", "hoodie", "boys", "dino"], 30);

    let p20 = mk(2, ?24, "CloudStep Running Shoes",
      "Ultralight mesh upper, responsive EVA midsole, memory foam insole. Zero break-in time.",
      74.99, ?99.99, 95, "CSR-WHT-42",
      ["https://picsum.photos/seed/shoes1/600/600", "https://picsum.photos/seed/shoes1b/600/600"],
      ["shoes", "running", "sports", "lightweight"], 15);

    let p21 = mk(2, ?25, "LuxLeather Full-Grain Belt",
      "35mm full-grain leather belt with brushed gunmetal pin buckle. Classic, sturdy, and ageless.",
      29.99, ?39.99, 300, "LLB-BRN-M",
      ["https://picsum.photos/seed/belt1/600/600"],
      ["accessories", "belt", "leather", "men"], 50);

    let p22 = mk(2, ?25, "WrapStyle Silk Scarf",
      "100% silk twill scarf, hand-rolled edges, 90×90cm botanical print. Versatile wear, gift-ready.",
      44.99, ?59.99, 130, "WSS-BOT-ONE",
      ["https://picsum.photos/seed/scarf1/600/600"],
      ["accessories", "scarf", "silk", "women"], 20);

    [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12,
     p13, p14, p15, p16, p17, p18, p19, p20, p21, p22];
  };
};
