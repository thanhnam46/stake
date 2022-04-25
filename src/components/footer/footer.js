import "./footer.css";
import sporesLogo from "../../sporesLogo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faMedium,
  faInstagram,
  faPinterest,
  faFacebook,
  faTelegram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/fontawesome-free-brands";
function Footer() {
  return (
    <div className="footer">
      <ul className="menu listStyleNone">
        <p>Menu</p>
        <li>
          <a href="https://launchpad.spores.app/">Launchpad</a>
        </li>
        <li>
          <a href="https://marketplace.spores.app/">Marketplace</a>
        </li>
      </ul>
      <div className="connect">
        <p>Connect</p>
        <ul>
          <li>
            <a href="https://spores.medium.com/">
              <FontAwesomeIcon icon={faMedium} />
            </a>
          </li>
          <li>
            <a href="https://instagram.com/SporesNetwork">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </li>
          <li>
            <a href="https://pinterest.com/SporesNetwork">
              <FontAwesomeIcon icon={faPinterest} />
            </a>
          </li>
          <li>
            <a href="https://facebook.com/SporesNetwork">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a href="https://t.me/SporesOfficial">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/Spores_Network">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </li>
          <li>
            <a href="https://www.youtube.com/channel/UC9pgjF_aWprnVodvxO7OPkA">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/company/SporesNetwork">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </li>
        </ul>
      </div>
      <ul>
        <p>Legal</p>
        <li>
          <a href="https://marketplace.spores.app/terms-of-use">Term of use</a>
        </li>
        <li>
          <a href="https://marketplace.spores.app/privacy-policy">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="https://marketplace.spores.app/cookie-statement">
            Cookie Statement
          </a>
        </li>
      </ul>
      <img src={sporesLogo} />
    </div>
  );
}
export default Footer;
