import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#081F5C] mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Effective Date: July 26, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Beyond Career (“the Company”, “we”, “us”, or “our”) deeply acknowledges the critical importance of privacy
              in the modern digital landscape and endeavors to uphold an unyielding commitment to the protection,
              confidentiality, and lawful processing of all personal and non-personal information that users (“you”,
              “your”, or “User”) entrust to the platform accessible via www.beyondcareer.online and associated services
              (collectively, “the Platform”). This Privacy Policy (“Policy”) governs the manner, extent, and lawful
              basis by which Beyond Career collects, utilizes, stores, processes, discloses, and otherwise manages any
              data obtained through your interaction with the Platform, whether as a guest, registered user, client,
              administrator, or third party. By utilizing, accessing, or interacting with the Platform in any capacity,
              you unconditionally consent to the terms, provisions, and methodologies articulated within this document,
              and acknowledge that your continued use constitutes binding acceptance hereof; if you do not so consent,
              you are strictly advised to refrain from utilizing or accessing the Platform completely.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">1. SCOPE OF THIS POLICY</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Policy applies comprehensively to all users and stakeholders engaging with the Platform globally,
                regardless of jurisdiction, unless explicitly superseded by applicable local, national, or international
                statutes mandating more stringent provisions. This Policy expressly excludes third-party websites,
                services, or actors not under our explicit ownership or operational control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">2. DEFINITIONS</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Platform:</strong> All web pages, apps, and digital properties constituting “Beyond Career”.
                </li>
                <li>
                  <strong>User:</strong> Any individual or entity using the Platform, including students, job seekers,
                  event attendees, clients, opportunity providers, administrators.
                </li>
                <li>
                  <strong>Personal Data:</strong> Any information which identifies or can be reasonably linked to an
                  individual.
                </li>
                <li>
                  <strong>Clients/Organizers:</strong> Individuals/organizations hosting or managing opportunities,
                  events, or content on the Platform.
                </li>
                <li>
                  <strong>Opportunities:</strong> Job listings, internships, events, challenges, and related submissions
                  or content.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">3. INFORMATION WE COLLECT</h2>

              <h3 className="text-xl font-semibold text-[#081F5C] mb-3">3.1 Data Provided Directly by You</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you personally submit, including but not limited to your full legal name,
                validated email address, encrypted password, contact information, academic institution, program details,
                graduation year, skills, profile photo, professional links (e.g., LinkedIn, GitHub), uploaded
                resumes/CVs, job or event application data, event registration details, and any communications or
                feedback you provide.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Registration Data:</strong> Full name, email, encrypted password, country, state, city, date
                  of birth, gender (optional), educational institution, degree/program, year/expected graduation, phone
                  number (optional), academic/professional experience, skills, profile photo, LinkedIn/GitHub links
                  (optional), and any other information you voluntarily provide.
                </li>
                <li>
                  <strong>Application Data:</strong> Documents and answers provided in job/internship/event
                  applications, including resumes/CVs and supporting files.
                </li>
                <li>
                  <strong>Event Registration:</strong> Data entered for event participation (e.g., name, contact
                  details, payment where applicable).
                </li>
                <li>
                  <strong>Feedback & Support:</strong> Communications sent via help, feedback, or contact forms.
                </li>
                <li>
                  <strong>Payment Info:</strong> For paid features/events, payment data (handled by certified
                  third-party payment processors; we do not store full payment card details).
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[#081F5C] mb-3">3.2 Automatically Collected Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Automatic collection includes IP address, device and browser details, session data, browsing activity,
                cookie identifiers, timestamps, click behavior, and aggregated analytics data used for operational,
                security, and improvement purposes.
              </p>

              <h3 className="text-xl font-semibold text-[#081F5C] mb-3">3.3 Third-party & Social Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you authenticate using social login providers (Google, LinkedIn, etc.), we collect profile
                information as permitted by your privacy settings. Data provided directly to external clients or
                organizers may be processed in accordance with their policies, over which Beyond Career holds no
                control.
              </p>

              <h3 className="text-xl font-semibold text-[#081F5C] mb-3">3.4 Sensitive Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Beyond Career never intentionally solicits or processes sensitive “special category” data (race, health,
                religion, etc.) unless explicitly provided by you for a clear purpose (e.g., opportunity application).
                Such information is processed solely as required by law or the function you requested, and always at
                your discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">4. PURPOSES FOR PROCESSING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We utilize your information to provide, maintain, and personalize platform services, administer user
                accounts, process applications and event registrations, communicate critical information, conduct
                analytics and research, enforce platform policies, and fulfill all legal and contractual obligations.
                Your data enables us to deliver a secure, fraud-resistant, and user-centric Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">5. LEGAL BASIS FOR PROCESSING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We process data on the lawful basis of:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Performance of contract (i.e., to fulfill services you request)</li>
                <li>Legitimate business interests (i.e., site analytics, fraud prevention)</li>
                <li>Legal obligations (to comply with law, enforce agreements)</li>
                <li>
                  Your explicit and informed consent (marketing, newsletters, specific data such as social logins)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">6. SHARING AND DISCLOSURE</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We never sell or rent your personal information.</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may share data in the following circumstances and to the minimum extent required:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>
                  <strong>Service Providers:</strong> With trusted vendors (e.g., hosting, analytics, payment), strictly
                  limited to the service provision under robust data processing agreements.
                </li>
                <li>
                  <strong>Employers/Organizers:</strong> When you apply/register for jobs, internships, or events, your
                  application data is shared only with relevant clients/organizers for specified purposes.
                </li>
                <li>
                  <strong>Legal & Compliance:</strong> To authorities, government bodies, courts, or law enforcement as
                  required, or to enforce our terms and safeguard our rights/property.
                </li>
                <li>
                  <strong>Corporate Transactions:</strong> To successors or acquirers in case of merger, reorganization,
                  or sale, and only to the extent permitted by law.
                </li>
                <li>
                  <strong>Aggregated Data:</strong> We may share anonymized, aggregated usage data that cannot identify
                  individuals for reporting, research, or promotional purposes.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Beyond Career is not responsible for data voluntarily provided by you to third-party clients,
                organizers, or in forums/groups not directly under our control (such as WhatsApp or external recruitment
                sites).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">7. COOKIES & TRACKING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies for authentication, remembering preferences, site analytics,
                security, and content customization.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Third-party cookies (e.g., Google Analytics) may collect information in accordance with their own
                privacy policies.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control or disable cookies in your browser settings, but some features may not function as
                intended.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">8. DATA SECURITY</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All data is encrypted in-transit (HTTPS). Sensitive data (e.g., passwords) is hashed at rest. Access is
                restricted to authorized personnel only; robust logging and regular audits are performed.
                Industry-standard firewalls, anti-malware, and intrusion prevention measures are implemented.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Payment data is processed/helped by PCI DSS compliant providers; we never store sensitive card details.
                Users must maintain confidentiality of their own passwords and promptly report any suspected compromise.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">9. DATA RETENTION</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain account and profile data as long as your account is active or as needed to provide services
                and comply with legal obligations. If you close your account, we will delete or anonymize your data
                except as required for dispute resolution, legal compliance, or legitimate business needs (max. legal
                retention period: 5 years unless a longer retention is mandated by law or allowed for legitimate
                pursuits). Backups are maintained in secure environments and expunged on a rolling basis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">10. INTERNATIONAL TRANSFERS</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your data may be processed and stored in jurisdictions outside your home country under data protection
                arrangements complying with local and international data protection standards, such as Standard
                Contractual Clauses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">11. YOUR RIGHTS</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your local laws, you may have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Access, correct, update, and delete your personal data.</li>
                <li>Withdraw consent for specific uses or marketing communications.</li>
                <li>Restrict or object to processing in some contexts (e.g., for direct marketing or profiling).</li>
                <li>Receive your data in a portable format.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may exercise these rights by contacting mahavirkumar@beyondcareer.online. We may require account
                verification prior to fulfilling your request and are entitled to deny unfounded/repetitive/illegal
                requests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">
                12. LINKS, EXTERNAL PARTIES, AND THIRD-PARTY SERVICES
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Beyond Career may contain links to external sites, such as employer sites, WhatsApp groups, or payment
                processors. We are not responsible for those sites’ privacy practices or content. Your activity on those
                sites is governed by their terms and policies. Data you provide through external forms or in
                communications to organizers or employers is not governed by this Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">13. CHILDREN’S DATA</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Platform is not intended for children under 16. We do not knowingly collect or process data
                belonging to children under that age. If discovered, such data will be deleted promptly and accounts
                terminated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">14. UPDATES TO THIS POLICY</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to amend this Policy at our sole discretion for business, operational, legal, or
                technical reasons. Updates take effect immediately when posted; substantial changes will be communicated
                via the Platform or via email. Continuing use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">
                15. LIABILITY, INDEMNITY, AND LEGAL GOVERNANCE
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Beyond Career shall not be liable for any damage or loss arising from unauthorized access, data breach,
                or data misuse caused by unforeseen technology flaws, force majeure, or user negligence. The Platform is
                provided “AS IS” and “AS AVAILABLE”. Use is at your own risk; we offer no express or implied warranties
                regarding the security, completeness, or fitness of your information or the content provided.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                In any event, our maximum liability shall not exceed the amount paid (if any) by you for Platform
                services in the preceding twelve months or as permitted under applicable law. You agree to defend,
                indemnify, and hold Beyond Career, its staff, directors, and affiliates harmless from claims arising due
                to your breach of this policy, misuse of data, or unauthorized activity. Any dispute or claim shall be
                governed by the laws of the jurisdiction in which Beyond Career is established, and exclusive venue for
                disputes shall be the local courts.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#081F5C] mb-4">16. CONTACT US</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions, requests, or concerns about this policy or your data, please reach out:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> mahavirkumar@beyondcareer.online
                  <br />
                  <strong>Mail:</strong> Beyond Career, RP Hall Of Residence, IIT Kharagpur
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                By using Beyond Career, you acknowledge you have read, understood, and agree to be bound by this Privacy
                Policy in its entirety. If you do not accept it, please discontinue use of the Platform immediately.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
