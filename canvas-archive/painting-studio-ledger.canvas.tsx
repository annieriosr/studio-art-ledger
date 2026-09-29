import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

export default function PaintingStudioLedger() {
  return (
    <Stack gap={28}>
      <Stack gap={8}>
        <H1>A painting ledger that lasts</H1>
        <Text tone="secondary">
          What working collections actually keep — not which app to subscribe
          to. For a studio that already has work leaving for collectors, and
          an Excel file that will not survive that.
        </Text>
      </Stack>

      <Callout tone="info" title="Verdict">
        Do not replace Excel with a prettier Excel. Keep three books that
        museums keep separate: a catalogue of what each work is, a log of
        where it has been, and a file of what you have issued. The identity
        of a painting never changes. Custody does. Excel fails because it
        overwrites the second into the first.
      </Callout>

      <Row gap={24} wrap>
        <Stat value="42" label="Works in the studio book" />
        <Stat value="24" label="The ones you asked to keep in view" />
        <Stat value="22" label="People, phones kept off the page" />
      </Row>

      <Callout tone="neutral" title="Entered 29 August 2026">
        Your Excel was a 2020 sales book, not a catalogue. “Both concepts”
        is BoConcept Panamá (19 March 2026). The Guatemala auction is
        Juannio, Museo Miraflores. The catalogue title is Cost of Love —
        you also call it Because of Love. José Pablo is Reigosa in the
        Excel, not Reynosa. August 2026: Faustino Huembes (stills),
        Sebastián Hemil / Sebas (film), Hispania Media TV with Isabella
        Fiore. Open studio-ledger/index.html — view Prensa y archivo.
      </Callout>

      <H2>The works you named</H2>
      <Table
        headers={["No.", "Title", "Now"]}
        rows={[
          ["AR-2026-002", "Cost of Love", "Sold — Juannio, anonymous, 3500. Confirm her name."],
          ["AR-2026-003", "Beauty in the Ruins", "Sold — José Pablo Reigosa, BoConcept, 800"],
          ["AR-2026-005", "Untitled (BoConcept)", "Sold — Carolina Cardoso, 450"],
          ["AR-ND-008", "Untitled (París)", "Sold — anonymous, 500. Confirm her name."],
          ["AR-2023-001", "De donde venimos", "Sold 2020 — Victoria de León y familia. Confirm 10×70"],
          ["AR-2023-002", "Gold Mine", "Sold — Isabela Lezi y familia"],
          ["AR-2023-003", "Silent Spirit", "Reigosa family; lent back for BoConcept 2026"],
          ["AR-2023-004", "Howard", "Sold — José Pablo Reigosa; shown BoConcept 2026"],
          ["AR-2026-001", "What Remains Below", "BoConcept 2026 — not sold"],
          ["AR-2025-002", "Be the Light", "BoConcept 2026 — not sold"],
          ["AR-2025-001", "All the Ways We Shine", "BoConcept 2026"],
          ["AR-2026-004", "All the Ways Humans Feel Loved", "BoConcept 2026"],
          ["AR-2025-003", "The InBetween Space", "Exhibited, not sold"],
          ["AR-ND-010", "Point of Incidence", "BoConcept Panamá 2026 — exhibited only. Oil in Youth does not exist."],
          ["AR-2026-WIP-001", "Untitled, in progress", "Photographed by Huembes and filmed by Hemil, Aug 2026"],
          ["AR-2025-004", "Three Elements of Art Fraction", "Centro Espacio Arte, Sep 2025. Mala Hierba."],
          ["AR-ND-001", "Casa Amarilla", "Madrid and BoConcept"],
          ["AR-2022-001", "Red Thread", "Madrid, year maybe 2022"],
          ["AR-ND-002", "Casa María", "Madrid"],
          ["AR-ND-003", "El Ocaso", "Madrid"],
          ["AR-ND-004–006", "Blue Mosaics, Final de Verano, Sink and Ship", "Visual Gallery"],
          ["AR-ND-007", "Amar Ciegamente", "París"],
        ]}
        striped
      />
      <Text size="small" tone="secondary">
        Eighteen further 2020 studio sales are in the book under AR-2020-*.
        Phone numbers live only in studio-ledger/data/contacts.private.json.
      </Text>

      <Divider />

      <Stack gap={10}>
        <H2>Why the spreadsheet dies</H2>
        <Text>
          A row in Excel is a snapshot. When a painting leaves the studio,
          most people change the Location cell from “studio” to the
          collector’s name. That is the moment the record stops being a
          ledger. You can no longer say where it was last March, or when the
          care letter went out, or whether the stretcher note was written
          before or after the sale.
        </Text>
        <Text>
          Images live in another folder. Filenames drift. Titles get
          rewritten. There is no inventory number on the canvas itself, so
          the file and the object can part ways. That is not a software
          problem. It is a bookkeeping problem that every museum solved the
          same way: one number that never changes, written on the object,
          and a second book that only adds lines.
        </Text>
      </Stack>

      <H2>The three books</H2>
      <Grid columns={3} gap={12}>
        <Card>
          <CardHeader trailing={<Pill size="sm" active>Never overwrite</Pill>}>
            Catalogue
          </CardHeader>
          <CardBody>
            <Text size="small">
              What the work is. Title, year, medium, size, stretcher depth,
              inscriptions, a photograph. This is Object ID. You fill it once
              when the painting leaves the easel, then you almost never
              touch it.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing={<Pill size="sm" active>Only append</Pill>}>
            Movement
          </CardHeader>
          <CardBody>
            <Text size="small">
              Where it has been. Finished, photographed, reserved, sold,
              loaned, returned, placed. Each line has a date, a place, and a
              person. This is what Spectrum calls location and movement
              control. The current location is simply the last line.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing={<Pill size="sm" active>Generated</Pill>}>
            Documents
          </CardHeader>
          <CardBody>
            <Text size="small">
              What you issued. Invoice, certificate, the collector letter,
              a condition note. These are not extra columns. They are
              produced from the catalogue plus the latest movement. If the
              letter is written by hand into Excel, it will drift from the
              record.
            </Text>
          </CardBody>
        </Card>
      </Grid>

      <Stack gap={8}>
        <H3>What that looks like for one painting</H3>
        <Text size="small" tone="secondary">
          Work AR-2026-014. Identity stays put. Only the log grows.
        </Text>
        <Table
          headers={["Date", "Event", "Where", "Issued"]}
          columnAlign={["left", "left", "left", "left"]}
          rows={[
            ["12 Mar 2026", "Finished", "Studio", "—"],
            ["14 Mar 2026", "Photographed", "Studio", "Front, verso, raking light"],
            ["2 Apr 2026", "Sold", "Left studio", "Invoice 2026-011"],
            ["5 Apr 2026", "Placed", "Collector home", "Care letter"],
          ]}
          rowTone={["neutral", "neutral", "info", "success"]}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>The identity of a work</H2>
        <Text>
          Interpol, ICOM, and the Getty agreed on nine facts that identify
          an object if it is lost or disputed. That checklist is Object ID
          (1997). It is the only inventory standard that police, insurers,
          and museums already share. For a painter it is almost the whole
          catalogue.
        </Text>
        <Table
          headers={["Object ID field", "In the studio"]}
          rows={[
            ["Type of object", "Painting. Unframed canvas on stretcher."],
            ["Materials and techniques", "Oil on linen — keep the phrasing identical every time."],
            ["Measurements", "Height × width × depth, always in cm, stretcher included."],
            ["Inscriptions and markings", "Signature, and the inventory number on the verso."],
            ["Distinguishing features", "The quiet things: a repaired corner, a particular shadow."],
            ["Title", "The title as it will appear on invoices. Do not rename later."],
            ["Subject", "A short line — enough for you, not a wall text."],
            ["Date or period", "Year finished. Circa only if you truly do not know."],
            ["Maker", "Annie Ríos."],
          ]}
          striped
        />
        <Text size="small" tone="secondary">
          Source: ICOM Object ID checklist. Recommended extras that belong
          with identity, not with movement: inventory number, date
          documented, related photographs.
        </Text>
      </Stack>

      <Stack gap={8}>
        <H3>The number on the back</H3>
        <Text>
          Museums write the inventory number on the object. Artists who
          still have records from the 1970s did the same, in graphite, on
          the verso. Pick one format and never change it, even if the title
          changes.
        </Text>
        <Text>
          A format that will not collide with a gallery’s system later:{" "}
          <Text as="span" weight="semibold">
            AR-2026-001
          </Text>
          — initials, year finished, sequence that year. Photograph the
          verso with that number visible. The photo filename is the same
          number. That is the whole filing system.
        </Text>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>What people actually use</H2>
        <Text>
          The market splits three ways. Gallery operating systems (Artlogic,
          ArtCloud) are built for staff, consignments, and a public
          website. Artist inventory products (Artwork Archive, a few
          smaller catalogues) are built for a solo practice. Then there is
          the general database (Airtable, Notion, a folder of files) that
          you shape yourself.
        </Text>
        <Text>
          Artlogic is the wrong scale. It is what a gallery runs. Pricing
          starts around £42 a month for an artist studio and climbs fast.
          You do not need their CRM until you have a roster of collectors
          and loans across cities.
        </Text>
        <Table
          headers={["Option", "Fits if", "Breaks when", "You own the data?"]}
          rows={[
            [
              "Excel, as now",
              "Fewer than ~30 works, one person, no sales yet",
              "A work moves. Photos. A letter. A second year.",
              "Yes — until the file corrupts or forks",
            ],
            [
              "Artwork Archive",
              "You want a working catalogue this week, invoices and COAs included",
              "You need a document in your own voice, or the company changes plans",
              "Partial — CSV/XLS export; relations and image links flatten",
            ],
            [
              "Airtable",
              "You like tables, want linked collectors, and will design the schema",
              "The base is the product. Export is possible; the views are not",
              "Partial — CSV, not the automations",
            ],
            [
              "A ledger you own",
              "You already write letters, want bilingual records, and care that this outlives a subscription",
              "You have to open it. A tool you do not open is not a ledger",
              "Yes — files on disk, photos named by ID, CSV anytime",
            ],
          ]}
          rowTone={["danger", "info", "neutral", "success"]}
          striped
        />
        <Text size="small" tone="secondary">
          Artwork Archive artist plans (checked Aug 2026): Apprentice about
          $9/month billed annually, 100 pieces; Professional about $18/month.
          They do export. The export is a flat file. That is enough to
          leave. It is not enough to reconstruct the history of a work
          unless you also keep the movement log yourself.
        </Text>
      </Stack>

      <Callout tone="warning" title="The sustainability test">
        Ask one question of any tool: if the company vanished on a Tuesday,
        could you reconstruct every painting from a folder of photos and a
        table of facts? Paper registers from the 1970s still work. Gallery
        software from 2008 often does not. Own the files. Treat the app as
        a window.
      </Callout>

      <Divider />

      <Stack gap={10}>
        <H2>What is worth automating</H2>
        <Text>
          Automation that helps is boring. A new finished work creates a
          numbered record and a photo folder. A sale appends a movement
          line, attaches the collector, and fills the care letter. Once a
          year, an insurance list prints. That is the list.
        </Text>
        <Text>
          Automation that does not help: auto-titling, auto-pricing,
          “AI catalogue.” Identity has to be written by you. The number on
          the verso has to be written by you. Everything downstream can be
          generated. That is why the collector letter should come out of
          the record, not live beside it.
        </Text>
        <Table
          headers={["When this happens", "The ledger should"]}
          rows={[
            ["Painting leaves the easel", "Mint AR-YYYY-NNN, open a photo folder, lock identity fields"],
            ["You photograph it", "Attach front / verso / detail to that ID, never to the title"],
            ["It sells or is reserved", "Append a movement line. Do not edit Location."],
            ["It goes to a collector", "Append movement. Issue COA. Fill Para on the care letter and the certificate."],
            ["You are asked where a work is", "Read the last movement line. That is the answer."],
            ["You want the homes that hold work you care about", "Filter collectors by the works flagged as yours to watch"],
          ]}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Collectors are a fourth book</H2>
        <Text>
          The ledger of paintings does not tell you who is living with the
          work you care about. That is a book of people. One collector
          record, many works. The current owner is not a cell on the
          painting — it is the last movement line, pointing at a person.
        </Text>
        <Text>
          Flag the paintings that matter to you. Then you can ask the only
          question that is actually yours: which homes hold the work I
          still think about. That is not accounting. It is the reason to
          keep a people file at all.
        </Text>
        <Table
          headers={["On the person", "On the work"]}
          rows={[
            ["Name, how to write, city", "Inventory number — never the collector’s name"],
            ["Works they hold (derived)", "Last movement: sold / placed / loaned"],
            ["Notes you do not put on a certificate", "Flag: a work you want to keep in view"],
          ]}
          striped
        />
      </Stack>

      <Stack gap={10}>
        <H2>What a certificate actually is</H2>
        <Text>
          A certificate of authenticity is a document issued from the
          catalogue, not a separate object with its own facts. The
          non-negotiable fields are Object ID plus the inventory number,
          a photograph of the work on the page, the date issued, and a
          wet-ink signature. Matching identifiers on the verso and on the
          paper are what bind them. That is settled practice in expert
          guidelines (Art Law Foundation, 2019): title, year, dimensions,
          medium, image, date, signature — and the verso available to
          inspect.
        </Text>
        <Text>
          Consistency is the trust signal. The certificate belongs to the
          same family as the care letter: same type, same voice, same
          number. A gallery that sees eleven identical issuances trusts
          the twelfth. A different phrasing every time does not.
        </Text>
        <Text>
          The paper has almost no legal force of its own. No general law
          says who may issue a studio certificate. New York and California
          regulate dealers of multiples; they do not make a hologram
          into proof. The weight is yours: the ledger, the number on the
          verso, the signature, the habit of issuing the same document
          every time. Design should look like that seriousness. It should
          not impersonate a mint.
        </Text>
      </Stack>

      <H3>Authenticity is a state, not a sticker</H3>
      <Table
        headers={["State", "What is true"]}
        rows={[
          ["Identified", "AR-YYYY-NNN minted. Object ID filled. Identity locked."],
          ["Marked", "Number written on the verso. Photographed with that number visible."],
          ["Certified", "Certificate issued from the record. Wet signature. Studio stamp in the seal."],
          ["Placed", "Collector named on the last movement line. Care letter and certificate both filled."],
          ["Optional later", "A public or digital duplicate — only after the four above exist."],
        ]}
        rowTone={["neutral", "info", "success", "success", "neutral"]}
        striped
      />

      <Stack gap={10}>
        <H2>Holograms, Arcual, Verisart</H2>
        <Text>
          Holographic seals and mould-made security paper are real
          products. Print publishers and platforms such as Verisart sell
          them. They are not what a painting studio at your scale is
          judged on. An appraiser looks for the number on the verso, the
          wet signature, and whether the studio can still produce the
          record. An empty circle on the certificate, reserved for your
          stamp, is enough physical layer until a hologram would actually
          change a conversation with a specific buyer.
        </Text>
        <Text>
          Arcual is real. It was co-founded in 2022 with Art Basel and the
          LUMA Foundation in the frame. It issues a digital certificate
          co-signed by artist and dealer, with a dossier that can carry
          resale terms. It is built for gallery networks on a permissioned
          chain. You do not need it until a gallery is issuing with you.
        </Text>
        <Text>
          Verisart is a working product: Bitcoin-timestamped certificates,
          optional hologram paper, QR stickers. Artists such as Shepard
          Fairey have used it. The claim that MoMA, LACMA, and the Centre
          Pompidou use Verisart for provenance does not hold. Those names
          appear because artists in Verisart NFT auctions also have work
          in those museums. That is a marketing adjacency, not
          institutional adoption. A low-cost Verisart record can wait.
          Pair it later if you want a public duplicate. Do not let it
          become the ledger.
        </Text>
      </Stack>

      <Callout tone="warning" title="Do not lead with theater">
        A matching hologram pair looks institutional in a product
        photograph. In a studio, the institutional fact is that you can
        still find AR-2026-014 in a book, on the verso, and on a
        certificate that all say the same thing — ten years from now,
        without that company.
      </Callout>

      <Divider />

      <Stack gap={10}>
        <H2>What I would build for this studio</H2>
        <Text>
          A ledger you own: works, movements, people, documents. The
          certificate and the care letter are generated from the same
          record, with the collector’s name in Para, the photograph
          embedded, the inventory number in one place. Spanish on the
          page. Access everywhere means the files travel — a folder of
          records plus photos named by ID — not a login.
        </Text>
        <Text>
          Easy means one action at sale: append movement, print
          certificate, print care letter. Lasting means the verso number
          can reconstruct a lost sheet.
        </Text>
        <Text>
          Confidence: high on the certificate fields and on skipping
          blockchain for now. Medium on when a physical hologram becomes
          worth the kit — that is a conversation with a specific buyer or
          gallery, not a default.
        </Text>
      </Stack>

      <Callout title="Next">
        Confirm the two anonymous buyers and the 10 × 70 cm on De donde
        venimos. Oil in Youth does not exist; Point of Incidence was
        shown at BoConcept only. The book is studio-ledger/index.html.
      </Callout>

      <CollapsibleSection title="Sources" count={12} defaultOpen={false}>
        <Stack gap={8}>
          <Text size="small">
            ICOM — Object ID checklist (Getty Information Institute, 1997;
            ICOM holds the licence). Nine identity fields plus photograph,
            short description, secure storage.
          </Text>
          <Text size="small">
            Getty — Introduction to Object ID. Adds inventory number,
            related documents, place, and date documented as recommended
            extras.
          </Text>
          <Text size="small">
            Collections Trust — Spectrum. Location and movement control is
            a primary procedure: current location is derived from a log,
            not stored as a single overwritten field.
          </Text>
          <Text size="small">
            CIDOC Fact Sheet 1 — Registration. The inventory number is
            allocated once and marked on the object.
          </Text>
          <Text size="small">
            Contemporary Art Issue — artist inventory practice. Catalogue
            number as CR-year-sequence; one row per work; exhibition and
            bibliography as history, not identity.
          </Text>
          <Text size="small">
            Artwork Archive help — CSV/XLS export of pieces, locations,
            contacts, sales. Confirmed as a leave path, not as a full
            relational archive.
          </Text>
          <Text size="small">
            Art Law Foundation — Guidelines for Experts authenticating
            works of Fine Art (2019 draft). Image on the certificate;
            verso available; title, year, medium, dimensions, date,
            signature.
          </Text>
          <Text size="small">
            Artnet News, 15 Nov 2022 — Arcual co-founded with Art Basel
            and LUMA; digital COA co-signed by artist and dealer;
            gallery-network rollout.
          </Text>
          <Text size="small">
            INVENTORY ANNIEWITHABRUSH.xlsx — 2020 sales book plus three
            2026 lines (Beauty in the Ruins, Untitled BoConcept, Cost of
            Love). Phones stripped from the public ledger.
          </Text>
          <Text size="small">
            Annie_Rios_Obras_Catalogo.xlsx — 2026 Panama selection:
            dimensions and oak-framed acrylic for What Remains Below,
            Cost of Love, Shine, Be the Light, The InBetween Space.
          </Text>
          <Text size="small">
            Juannio 2026 listings — Museo Miraflores, 28 May–12 Jul 2026;
            Annie Ríos listed for Panama. Eventbrite: All the Ways We Are
            Humans, BoConcept Panamá, 19 Mar 2026.
          </Text>
        </Stack>
      </CollapsibleSection>
    </Stack>
  );
}
