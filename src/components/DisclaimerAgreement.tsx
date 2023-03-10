import Modal, { useModal } from "components/Modal"
import Checkbox from "components/Checkbox"
import Button from "components/Button"
import { useEffect, useState } from "react"
import styled from "styled-components"

const ModalContent = styled.div`
  width: 100%;
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.35);
  background-color: #fff;
  padding: 30px 0px;

  color: #5c5c5c;
  & > div {
    position: relative;
    width: 100%;
    height: auto;
    max-height: 80vh;
    overflow-y: auto;
    padding: 0 30px;

    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: left;
    color: #5c5c5c;
  }

  @media screen and (max-width: ${({ theme }) => theme.breakpoint}) {
    padding: 30px 0px;
    & > div {
      padding: 0 16px;
    }
  }
`

const ModalTitle = styled.div`
  display: block;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: center;
  color: #0222ba;
  margin-bottom: 30px;
`

const Content = styled.div`
  border-radius: 12px;
  border: solid 1px #b5b5b5;
  background-color: #fff;
  padding: 12px;
  margin-bottom: 30px;
  max-height: 115px;
  overflow-y: auto;
`
const Disclaimer = () => {
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)

  const disclaimerModal = useModal()

  useEffect(() => {
    const agreed = window.localStorage.getItem("disclaimerAgreed")
    if (!agreed) {
      disclaimerModal.open()
    }
    if (agreed) {
      setDisclaimerAgreed(true)
    }
  }, [disclaimerModal])

  return (
    <Modal isOpen={disclaimerModal.isOpen} close={() => {}} open={() => {}}>
      <ModalContent>
        <div>
          <ModalTitle>You are accessing Terraswap</ModalTitle>
          <Content>
            Terraswap is a community dex. Terraswap team does not make any
            financial profit from it. We built Terraswap to support the
            community because we do believe our devotion makes the community
            stronger.
          </Content>
          <ModalTitle style={{ fontSize: 16, marginBottom: 15 }}>
            Disclaimer
          </ModalTitle>
          <Content>
            Terraswap Terms of Service
            <br />
            Last modified: March 10, 2023
            <br />
            <br />
            These Terms of Service (the “Agreement”) explain the terms and
            conditions by which you may access and use&nbsp;
            <a
              href="https://app.terraswap.io/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700 }}
            >
              https://app.terraswap.io
            </a>
            , a website-hosted user interface (the “Interface” or “App”)
            provided by DELIGHT LABS (“we”, “our”, or “us”). You must read this
            Agreement carefully as it governs your use of the Interface. By
            accessing or using the Interface, you signify that you have read,
            understand, and agree to be bound by this Agreement in its entirety.
            If you do not agree, you are not authorized to access or use the
            Interface and should not use the Interface.
            <br />
            <br />
            <b>
              NOTICE: This Agreement contains important information, including a
              binding arbitration provision and a class action waiver, both of
              which impact your rights as to how disputes are resolved. The
              Interface is only available to you — and you should only access
              the Interface — if you agree completely with these terms.
            </b>
            <br />
            <br />
            <b>Introduction</b>
            <br />
            The Interface provides access to a decentralized protocol on the
            Terra and Terra Classic networks, that allows users to trade certain
            compatible digital assets (“the Terraswap protocol” or the
            “Protocol”). The Interface is one, but not the exclusive, means of
            accessing the Protocol.
            <br />
            To access the Interface, you must use non-custodial wallet software,
            which allows you to interact with the Terra or Terra Classic
            network. Your relationship with that non-custodial wallet provider
            is governed by the applicable terms of service of that third party,
            not this Agreement. Wallets are not operated by, maintained by, or
            affiliated with us, and we do not have custody or control over the
            contents of your wallet and have no ability to retrieve or transfer
            its contents. By connecting your wallet to our Interface, you agree
            to be bound by this Agreement and all of the terms incorporated
            herein by reference.
            <br />
            <br />
            <b>Modification of this Agreement</b>
            <br />
            We reserve the right, in our sole discretion, to modify this
            Agreement from time to time. If we make any material modifications,
            we will notify you by updating the date at the top of the Agreement
            and by maintaining a current version of the Agreement at&nbsp;
            <a
              href="https://docs.terraswap.io/docs/introduction/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 700 }}
            >
              https://docs.terraswap.io/docs/introduction/terms-of-service
            </a>
            . All modifications will be effective when they are posted, and your
            continued accessing or use of the Interface will serve as
            confirmation of your acceptance of those modifications. If you do
            not agree with any modifications to this Agreement, you must
            immediately stop accessing and using the Interface.
            <br />
            <br />
            <b>Description of Services provided through the Interface</b>
            <br />
            The Interface provides a web or mobile-based means of accessing the
            Protocol.
            <br />
            The Interface is distinct from the Protocol and is one, but not the
            exclusive, means of accessing the Protocol. The Protocol itself
            comprises open-source or source-available self-executing smart
            contracts that are deployed on the Terra and Terra Classic networks.
            We do not operate the Protocol on the Terra and Terra Classic
            networks. By using the Interface, you understand that you are not
            buying or selling digital assets from us and that we do not operate
            any liquidity pools on the Protocol or control trade execution on
            the Protocol. When traders pay fees for trades, those fees accrue to
            liquidity providers for the Protocol. As a general matter, we are
            not a liquidity provider into Protocol liquidity pools and liquidity
            providers are independent third parties. The Protocol was deployed
            on the Terra and Terra Classic networks. Please note that digital
            assets that have been “bridged” or “wrapped” to operate on other
            blockchain networks are distinct from the original Terra and Terra
            Classic mainnet asset.
            <br />
            <br />
            <b>Eligibility</b>
            <br />
            To access or use the Interface, you must be able to form a legally
            binding contract with us. Accordingly, you represent that you are at
            least the age of majority in your jurisdiction and have the full
            right, power, and authority to enter into and comply with the terms
            and conditions of this Agreement on behalf of yourself and any
            company or legal entity for which you may access or use the
            Interface.
            <br />
            You further represent that you are not <b>(a)</b> the subject of
            economic or trade sanctions administered or enforced by any
            governmental authority or otherwise designated on any list of
            prohibited or restricted parties including but not limited to the
            lists maintained by the relevant authorities of the Republic of
            Korea, the United States, the United Kingdom, or the European Union;
            or <b>(b)</b> a citizen, resident, or organized in a jurisdiction or
            territory that is the subject of comprehensive country-wide,
            territory-wide, or regional economic sanctions by the Republic of
            Korea, the United States, the United Kingdom, the European Union or
            other relevant jurisdictions. Finally, you represent that your
            access and use of the Interface will fully comply with all
            applicable laws and regulations and that you will not access or use
            the Interface to conduct, promote, or otherwise facilitate any
            illegal activity.
            <br />
            <br />
            <b>Intellectual Property Rights</b>
            <br />
            We own all intellectual property and other rights in the Interface
            and its contents, including (but not limited to) software, text,
            images, trademarks, service marks, copyrights, patents, designs, and
            its “look and feel.” This intellectual property is available under
            the terms of our copyright licenses and our Trademark Guidelines.
            Unlike the Interface, the Protocol is comprised entirely of
            open-source or source-available software running on the Terra and
            Terra Classic networks.
            <br />
            <br />
            <b>Additional Rights</b>
            <br />
            We reserve the following rights, which do not constitute obligations
            of ours:
            <br />
            <b>(a)</b> with or without notice to you, to modify, substitute,
            eliminate or add to the Interface; <b>(b)</b> to review, modify,
            filter, disable, delete and remove any and all content and
            information from the Interface; and <b>(c)</b> to cooperate with any
            law enforcement, court or government investigation or order or third
            party requesting or directing that we disclose information or
            content or information that you provide.
            <br />
            <br />
            <b>Prohibited Activity</b>
            <br />
            You agree not to engage in, or attempt to engage in, any of the
            following categories of prohibited activity in relation to your
            access and use of the Interface:
            <br />
            <br />
            Intellectual Property Infringement. Activity that infringes on or
            violates any copyright, trademark, service mark, patent, right of
            publicity, right of privacy, or other proprietary or intellectual
            property rights under the law.
            <br />
            Cyberattack. Activity that seeks to interfere with or compromise the
            integrity, security, or proper functioning of any computer, server,
            network, personal device, or other information technology system,
            including (but not limited to) the deployment of viruses and denial
            of service attacks.
            <br />
            Fraud and Misrepresentation. Activity that seeks to defraud us or
            any other person or entity, including (but not limited to) providing
            any false, inaccurate, or misleading information in order to
            unlawfully obtain the property of another.
            <br />
            Market Manipulation. Activity that violates any applicable law,
            rule, or regulation concerning the integrity of trading markets,
            including (but not limited to) the manipulative tactics commonly
            known as “rug pulls”, pumping and dumping, and wash trading.
            <br />
            Securities and Derivatives Violations. Activity that violates any
            applicable law, rule, or regulation concerning the trading of
            securities or derivatives, including (but not limited to) the
            unregistered offering of securities and the offering of leveraged
            and margined commodity products to retail customers in the relevant
            jurisdiction.
            <br />
            Sale of Stolen Property. Buying, selling, or transferring of stolen
            items, fraudulently obtained items, items taken without
            authorization, and/or any other illegally obtained items.
            <br />
            Data Mining or Scraping. Activity that involves data mining, robots,
            scraping, or similar data gathering or extraction methods of content
            or information from the Interface.
            <br />
            Objectionable Content. Activity that involves soliciting information
            from anyone under the age of 18 or that is otherwise harmful,
            threatening, abusive, harassing, tortious, excessively violent,
            defamatory, vulgar, obscene, pornographic, libelous, invasive of
            another’s privacy, hateful, discriminatory, or otherwise
            objectionable.
            <br />
            Any Other Unlawful Conduct. Activity that violates any applicable
            law, rule, or regulation of a relevant jurisdiction.
            <br />
            <br />
            <b>Not Registered with the SEC or Any Other Agency</b>
            <br />
            We are not registered as a securities exchange with a regulatory
            authority in pertinent jurisdictions or in any other capacity. You
            understand and acknowledge that we do not broker trading orders on
            your behalf nor do we collect or earn fees from your trades on the
            Interface. We also do not facilitate the execution or settlement of
            your trades, which occur entirely on the public distributed
            blockchain, which is the Terra or Terra Classic network. As a
            result, we do not (and cannot) guarantee market best pricing or best
            execution through the Interface or when using our Auto Routing
            feature, which routes trades across liquidity pools on the Protocol
            only. Any references in the Interface to “best price” do not
            constitute a representation or warranty about pricing available
            through the Interface, on the Protocol, or elsewhere.
            <br />
            <br />
            <b>Non-Solicitation; No Investment Advice</b>
            <br />
            <b>You agree and understand that</b>
            <br />
            <b>a.</b> all trades you submit through the Interface are considered
            unsolicited, which means that they are solely initiated by you.
            <br />
            <b>b.</b> you have not received any investment advice from us in
            connection with any trades, including those you place via our Auto
            Routing API.
            <br />
            <b>c.</b> we do not conduct a suitability review of any trades you
            submit.
            <br />
            <br />
            We may provide information about tokens in the Interface sourced
            from third-party data partners through features such as token
            explorer or token lists (which includes the default token list and
            verified token lists hosted at
            https://github.com/terra-money/assets/blob/master/cw20/tokens.js and
            https://github.com/terra-money/assets/blob/master/ibc/tokens.js). We
            may also provide verified labels or warning dialogs for certain
            tokens. The provision of informational materials does not make
            trades in those tokens solicited; we are not attempting to induce
            you to make any purchase as a result of the information provided.
            All such information provided by the Interface is for informational
            purposes only and should not be construed as investment advice or a
            recommendation that a particular token is a safe or sound
            investment. You should not take, or refrain from taking, any action
            based on any information contained in the Interface. By providing
            token information for your convenience, we do not make any
            investment recommendations to you or opine on the merits of any
            transaction or opportunity. You alone are responsible for
            determining whether any investment, investment strategy, or related
            transaction is appropriate for you based on your personal investment
            objectives, financial circumstances, and risk tolerance.
            <br />
            <br />
            <b>Non-Custodial and No Fiduciary Duties</b>
            <br />
            The Interface is a purely non-custodial application, meaning we do
            not ever have custody, possession, or control of your digital assets
            at any time. It further means you are solely responsible for the
            custody of the cryptographic private keys to the digital asset
            wallets you hold and you should never share your wallet credentials
            or seed phrase with anyone. We accept no responsibility for, or
            liability to you, in connection with your use of a wallet and make
            no representations or warranties regarding how the Interface will
            operate with any specific wallet.
            <br />
            Likewise, you are solely responsible for any associated wallet and
            we are not liable for any acts or omissions by you in connection
            with or as a result of your wallet being compromised.
            <br />
            This Agreement is not intended to, and does not, create or impose
            any fiduciary duties on us. To the fullest extent permitted by law,
            you acknowledge and agree that we owe no fiduciary duties or
            liabilities to you or any other party, and that to the extent any
            such duties or liabilities may exist at law or in equity, those
            duties and liabilities are hereby irrevocably disclaimed, waived,
            and eliminated. You further agree that the only duties and
            obligations that we owe you are those set out expressly in this
            Agreement.
            <br />
            <br />
            <b>Compliance and Tax Obligations</b>
            <br />
            The Interface may not be available or appropriate for use in your
            jurisdiction.
            <br />
            By accessing or using the Interface, you agree that you are solely
            and entirely responsible for compliance with all laws and
            regulations that may apply to you.
            <br />
            Specifically, your use of the Interface or the Protocol may result
            in various tax consequences, such as income or capital gains tax,
            value-added tax, goods and services tax, or sales tax in certain
            jurisdictions.
            <br />
            It is your responsibility to determine whether taxes apply to any
            transactions you initiate or receive and, if so, to report and/or
            remit the correct tax to the appropriate tax authority.
            <br />
            <br />
            <b>Assumption of Risk</b>
            <br />
            By accessing and using the Interface, you represent that you are
            financially and technically sophisticated enough to understand the
            inherent risks associated with using cryptographic and
            blockchain-based systems including automated market making smart
            contract systems, and that you have a working knowledge of the usage
            and intricacies of digital assets such as LUNA, LUNC, so-called
            stablecoins, and other digital tokens such as those following the
            Cosmwasm Token Spec (CW-20).
            <br />
            In particular, you understand that the markets for these digital
            assets are nascent and highly volatile due to risk factors including
            (but not limited to) adoption, speculation, technology, security,
            and regulation. You understand that anyone can create a token,
            including fake versions of existing tokens and tokens that falsely
            claim to represent projects, and acknowledge and accept the risk
            that you may mistakenly trade those or other tokens. So-called
            stablecoins may not be as stable as they purport to be, may not be
            fully or adequately collateralized, and may be subject to panics and
            runs.
            <br />
            Further, you understand that smart contract transactions
            automatically execute and settle, and that blockchain-based
            transactions are irreversible when confirmed. You acknowledge and
            accept that the cost and speed of transacting with cryptographic and
            blockchain-based systems such as Terra blockchain are variable and
            may increase dramatically at any time. You further acknowledge and
            accept the risk of trading with additional parameters' settings
            (slippage tolerance, auto-router, and transaction deadline), which
            can expose you to potentially significant price slippage and higher
            costs.
            <br />
            If you act as a liquidity provider to the Protocol through the
            Interface, you understand that your digital assets may lose some or
            all of their value while they are supplied to the Protocol through
            the Interface due to the fluctuation of prices of tokens in a
            trading pair or liquidity pool.
            <br />
            Finally, you understand that we do not make any representation or
            warranty about the safety or soundness of any cross-chain bridge.
            <br />
            In summary, you acknowledge that we are not responsible for any of
            these variables or risks, do not own or control the Protocol, and
            cannot be held liable for any resulting losses that you experience
            while accessing or using the Interface.
            <br />
            Accordingly, you understand and agree to assume full responsibility
            for all of the risks of accessing and using the Interface to
            interact with the Protocol.
            <br />
            <br />
            <b>Third-Party Resources and Promotions</b>
            <br />
            The Interface may contain references or links to third-party
            resources, including (but not limited to) information, materials,
            products, or services, that we do not own or control. In addition,
            third parties may offer promotions related to your access and use of
            the Interface. We do not approve, monitor, endorse, warrant or
            assume any responsibility for any such resources or promotions. If
            you access any such resources or participate in any such promotions,
            you do so at your own risk, and you understand that this Agreement
            does not apply to your dealings or relationships with any third
            parties. You expressly relieve us of any and all liability arising
            from your use of any such resources or participation in any such
            promotions.
            <br />
            <br />
            <b>Release of Claims</b>
            <br />
            You expressly agree that you assume all risks in connection with
            your access and use of the Interface. You further expressly waive
            and release us from any and all liability, claims, causes of action,
            or damages arising from or in any way relating to your use of the
            Interface. If you are a California resident, you waive the benefits
            and protections of California Civil Code § 1542, which provides:
            <br />
            “[a] general release does not extend to claims that the creditor or
            releasing party does not know or suspect to exist in his or her
            favor at the time of executing the release and that, if known by him
            or her, would have materially affected his or her settlement with
            the debtor or released party.”
            <br />
            <br />
            <b>Indemnity</b>
            <br />
            You agree to hold harmless, release, defend, and indemnify us and
            our officers, directors, employees, contractors, agents, affiliates,
            and subsidiaries from and against all claims, damages, obligations,
            losses, liabilities, costs, and expenses arising from: <b>
              (a)
            </b>{" "}
            your access and use of the Interface; <b>(b)</b> your violation of
            any term or condition of this Agreement, the right of any third
            party, or any other applicable law, rule, or regulation; and{" "}
            <b>(c)</b> any other party's access and use of the Interface with
            your assistance or using any device or account that you own or
            control.
            <br />
            <br />
            <b>No Warranties</b>
            <br />
            The Interface is provided on an “AS IS” and “AS AVAILABLE” basis.{" "}
            <b>
              TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ANY
              REPRESENTATIONS AND WARRANTIES OF ANY KIND, WHETHER EXPRESS,
              IMPLIED, OR STATUTORY, INCLUDING (BUT NOT LIMITED TO) THE
              WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
              PURPOSE.
            </b>{" "}
            You acknowledge and agree that your use of the Interface is at your
            own risk. We do not represent or warrant that access to the
            Interface will be continuous, uninterrupted, timely, or secure; that
            the information contained in the Interface will be accurate,
            reliable, complete, or current; or that the Interface will be free
            from errors, defects, viruses, or other harmful elements. No advice,
            information, or statement that we make should be treated as creating
            any warranty concerning the Interface. We do not endorse, guarantee,
            or assume responsibility for any advertisements, offers, or
            statements made by third parties concerning the Interface.
            <br />
            Similarly, the Protocol is provided “AS IS”, at your own risk, and
            without warranties of any kind. No developer or entity involved in
            creating the Protocol will be liable for any claims or damages
            whatsoever associated with your use, inability to use, or your
            interaction with other users of, the Protocol, including any direct,
            indirect, incidental, special, exemplary, punitive or consequential
            damages, or loss of profits, cryptocurrencies, tokens, or anything
            else of value. We do not endorse, guarantee, or assume
            responsibility for any advertisements, offers, or statements made by
            third parties concerning the Interface.
            <br />
            <br />
            <b>Limitation of Liability</b>
            <br />
            <i>
              UNDER NO CIRCUMSTANCES SHALL WE OR ANY OF OUR OFFICERS, DIRECTORS,
              EMPLOYEES, CONTRACTORS, AGENTS, AFFILIATES, OR SUBSIDIARIES BE
              LIABLE TO YOU FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING (BUT NOT LIMITED
              TO) DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER
              INTANGIBLE PROPERTY, ARISING OUT OF OR RELATING TO ANY ACCESS OR
              USE OF THE INTERFACE, NOR WILL WE BE RESPONSIBLE FOR ANY DAMAGE,
              LOSS, OR INJURY RESULTING FROM HACKING, TAMPERING, OR OTHER
              UNAUTHORIZED ACCESS OR USE OF THE INTERFACE OR THE INFORMATION
              CONTAINED WITHIN IT. WE ASSUME NO LIABILITY OR RESPONSIBILITY FOR
              ANY: <b>(A)</b> ERRORS, MISTAKES, OR INACCURACIES OF CONTENT;{" "}
              <b>(B)</b> PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE
              WHATSOEVER, RESULTING FROM ANY ACCESS OR USE OF THE INTERFACE;{" "}
              <b>(C)</b> UNAUTHORIZED ACCESS OR USE OF ANY SECURE SERVER OR
              DATABASE IN OUR CONTROL, OR THE USE OF ANY INFORMATION OR DATA
              STORED THEREIN; <b>(D)</b> INTERRUPTION OR CESSATION OF FUNCTION
              RELATED TO THE INTERFACE; <b>(E)</b> BUGS, VIRUSES, TROJAN HORSES,
              OR THE LIKE THAT MAY BE TRANSMITTED TO OR THROUGH THE INTERFACE;{" "}
              <b>(F)</b> ERRORS OR OMISSIONS IN, OR LOSS OR DAMAGE INCURRED AS A
              RESULT OF THE USE OF, ANY CONTENT MADE AVAILABLE THROUGH THE
              INTERFACE; AND <b>(G)</b> THE DEFAMATORY, OFFENSIVE, OR ILLEGAL
              CONDUCT OF ANY THIRD PARTY.
            </i>
            <br />
            <br />
            <b>Dispute Resolution</b>
            <br />
            We will use our best efforts to resolve any potential disputes
            through informal, good faith negotiations. If a potential dispute
            arises, you must contact us by sending an email to
            contact@terraswap.io so that we can attempt to resolve it without
            resorting to formal dispute resolution. If we aren't able to reach
            an informal resolution within sixty days of your email, then you and
            we both agree to resolve the potential dispute according to the
            process set forth below.
            <br />
            <br />
            Any claim or controversy arising out of or relating to the
            Interface, this Agreement, or any other acts or omissions for which
            you may contend that we are liable, including (but not limited to)
            any claim or controversy as to arbitrability (“Dispute”), shall be
            finally and exclusively settled by arbitration in accordance with
            the International Arbitration Rules of the Korean Commercial
            Arbitration Board(KCAB Rules). The number of arbitrators shall be
            three. The seat, or legal place, of arbitral proceedings shall be
            Seoul/Republic of Korea. The language to be used in the arbitral
            proceedings shall be English. Unless we agree otherwise, the
            arbitrator may not consolidate your claims with those of any other
            party. Any judgment on the award rendered by the arbitrator may be
            entered in any court of competent jurisdiction.
            <br />
            <br />
            <b>Class Action and Jury Trial Waiver</b>
            <br />
            You must bring any and all Disputes against us in your individual
            capacity and not as a plaintiff in or member of any purported class
            action, collective action, private attorney general action, or other
            representative proceeding. This provision applies to class
            arbitration. You and we both agree to waive the right to demand a
            trial by jury.
            <br />
            <br />
            <b>Governing Law</b>
            <br />
            You agree that the laws of the Republic of Korea, without regard to
            principles of conflict of laws, govern this Agreement and any
            Dispute between you and us. You further agree that the Interface
            shall be deemed to be based solely in the Republic of Korea, and
            that although the Interface may be available in other jurisdictions,
            its availability does not give rise to general or specific personal
            jurisdiction in any forum outside the Republic of Korea. Any
            arbitration conducted pursuant to this Agreement shall be governed
            by the Arbitration Act of the Republic of Korea. You agree that the
            courts of the Republic of Korea are the proper forum for any appeals
            of an arbitration award or for court proceedings in the event that
            this Agreement's binding arbitration clause is found to be
            unenforceable.
            <br />
            <br />
            <b>Entire Agreement</b>
            <br />
            These terms constitute the entire agreement between you and us with
            respect to the subject matter hereof. This Agreement supersedes any
            and all prior or contemporaneous written and oral agreements,
            communications and other understandings (if any) relating to the
            subject matter of the terms.
          </Content>
          <div
            style={{ textAlign: "center", padding: "0 26px", marginBottom: 30 }}
          >
            <Checkbox
              onClick={() => setDisclaimerAgreed((current) => !current)}
              checked={disclaimerAgreed}
            >
              I understand the risks and would like to proceed
            </Checkbox>
          </div>
          <Button
            size="lg"
            disabled={!disclaimerAgreed}
            onClick={() => {
              window.localStorage.setItem("disclaimerAgreed", "yes")
              disclaimerModal.close()
            }}
            style={{ textTransform: "unset", maxWidth: 235, borderRadius: 10 }}
          >
            Agree and Proceed
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}

export default Disclaimer
