import { Helmet } from "react-helmet-async";
import useLanguage from "../context/useLanguage";
import { ArtistLinkedText } from "../components/ArtistName";

const PAGE_URL = "https://www.benett-peintre.fr/confidentialite";

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const en = language === "en";

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>{en ? "Privacy policy | Benett Gallery" : "Politique de confidentialité | Galerie Benett"}</title>
        <meta
          name="description"
          content={en ? "How the François Benett website protects and uses personal data." : "Comment le site de François Benett protège et utilise les données personnelles."}
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>

      <main className="legal-page">
        <header className="legal-header">
          <span>{en ? "Your data" : "Vos données"}</span>
          <h1>{en ? "Privacy policy" : "Politique de confidentialité"}</h1>
          <p>{en ? "Last updated: 19 July 2026" : "Dernière mise à jour : 19 juillet 2026"}</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>{en ? "Data controller" : "Responsable du traitement"}</h2>
            <p>
              <ArtistLinkedText>{en ? "François Benett is responsible for the processing of personal data collected through this website." : "François Benett est responsable du traitement des données personnelles collectées par ce site."}</ArtistLinkedText>
            </p>
            <p>
              {en ? "For any privacy enquiry: " : "Pour toute question relative à vos données : "}
              <a href="mailto:benett.peintre@hotmail.fr">benett.peintre@hotmail.fr</a>.
            </p>
            <p>
              {en ? "Postal address: " : "Adresse postale : "}
              8 rue Alphonse Daudet, 44130 Blain, France.
            </p>
          </section>

          <section>
            <h2>{en ? "Contact form" : "Formulaire de contact"}</h2>
            <p>
              {en
                ? "When you use the contact form, the website collects your name, email address, the subject of your request and your message. These details are required in order to reply to you."
                : "Lorsque vous utilisez le formulaire de contact, le site collecte votre nom, votre adresse e-mail, le sujet de votre demande et votre message. Ces informations sont nécessaires pour pouvoir vous répondre."}
            </p>
            <p>
              <ArtistLinkedText>{en
                ? "The processing is based on François Benett’s legitimate interest in answering enquiries and, where your request concerns a possible purchase or project, on steps taken at your request before entering into a contract. Your data is not used for advertising and is not sold."
                : "Le traitement repose sur l’intérêt légitime de François Benett à répondre aux demandes et, lorsqu’elles concernent un éventuel achat ou projet, sur les démarches précontractuelles effectuées à votre demande. Vos données ne sont pas utilisées à des fins publicitaires et ne sont jamais vendues."}</ArtistLinkedText>
            </p>
          </section>

          <section>
            <h2>{en ? "Recipients and service providers" : "Destinataires et prestataires"}</h2>
            <p>
              <ArtistLinkedText>{en
                ? "Messages are received by François Benett. The website is hosted by Vercel and messages are transmitted using Resend (Plus Five Five, Inc.), which act as technical service providers. Resend stores email service data in the United States and states that its data processing agreement includes the safeguards required for transfers from the European Union."
                : "Les messages sont reçus par François Benett. Le site est hébergé par Vercel et les messages sont transmis à l’aide de Resend (Plus Five Five, Inc.), qui interviennent comme prestataires techniques. Resend indique héberger les données liées à son service de messagerie aux États-Unis et prévoir dans son accord de traitement les garanties applicables aux transferts depuis l’Union européenne."}</ArtistLinkedText>
            </p>
            <p className="legal-inline-links">
              <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">{en ? "Vercel privacy notice" : "Confidentialité de Vercel"}</a>
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">{en ? "Resend privacy policy" : "Confidentialité de Resend"}</a>
            </p>
          </section>

          <section>
            <h2>{en ? "Retention" : "Durée de conservation"}</h2>
            <p>
              {en
                ? "Contact requests are retained for no longer than 12 months after the last exchange, unless a longer period is required to manage a contractual relationship or comply with a legal obligation."
                : "Les demandes de contact sont conservées au maximum 12 mois après le dernier échange, sauf lorsqu’une durée plus longue est nécessaire à la gestion d’une relation contractuelle ou au respect d’une obligation légale."}
            </p>
          </section>

          <section>
            <h2>{en ? "Performance measurement and cookies" : "Mesure de performance et cookies"}</h2>
            <p>
              {en
                ? "The website uses Vercel Speed Insights to measure technical performance. Vercel states that the collected data points are anonymous, are not associated with an individual visitor or IP address, and cannot be used to reconstruct navigation across pages. The website does not use advertising cookies or advertising trackers. Therefore, no consent banner is displayed at this time."
                : "Le site utilise Vercel Speed Insights pour mesurer ses performances techniques. Vercel indique que les points de mesure collectés sont anonymes, ne sont associés ni à un visiteur individuel ni à une adresse IP et ne permettent pas de reconstituer une navigation entre les pages. Le site n’utilise ni cookies publicitaires ni traceurs publicitaires. Aucun bandeau de consentement n’est donc affiché actuellement."}
            </p>
            <p>
              <a href="https://vercel.com/docs/speed-insights/privacy-policy" target="_blank" rel="noopener noreferrer">
                {en ? "Learn about Speed Insights privacy" : "Consulter les informations de confidentialité de Speed Insights"}
              </a>
            </p>
          </section>

          <section>
            <h2>{en ? "Your rights" : "Vos droits"}</h2>
            <p>
              {en
                ? "Depending on the applicable legal basis, you may request access to, rectification or deletion of your data, restriction of processing, or object to processing. To exercise your rights, write to "
                : "Selon la base légale applicable, vous pouvez demander l’accès à vos données, leur rectification ou leur effacement, la limitation de leur traitement, ou vous opposer à ce traitement. Pour exercer vos droits, écrivez à "}
              <a href="mailto:benett.peintre@hotmail.fr">benett.peintre@hotmail.fr</a>.
            </p>
            <p>
              {en ? "If, after contacting us, you believe your rights have not been respected, you may submit a complaint to the French data protection authority (CNIL)." : "Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la Commission nationale de l’informatique et des libertés (CNIL)."}
            </p>
            <p>
              <a href="https://www.cnil.fr/fr/adresser-une-plainte" target="_blank" rel="noopener noreferrer">
                {en ? "Submit a complaint to the CNIL" : "Adresser une réclamation à la CNIL"}
              </a>
            </p>
          </section>

          <section>
            <h2>{en ? "Changes" : "Modifications"}</h2>
            <p>
              {en
                ? "This policy may be updated if the website, its service providers or the applicable rules change. The date shown at the top identifies the latest version."
                : "Cette politique pourra être mise à jour si le site, ses prestataires ou les règles applicables évoluent. La date indiquée en haut de page permet d’identifier la dernière version."}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
