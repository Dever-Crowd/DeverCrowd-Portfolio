import { FaPhone } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

export const informations = [
  { icon: <FaPhone />, key: "Phone", value: "+201030141149" },
  { icon: <MdMail />, key: "Email", value: "swilam.per@gmail.com" },
  { icon: <FaMapLocationDot />, key: "Location", value: "Egypt" },
];

export const socials = [
  { icon: <IoLogoWhatsapp />, link: "https://wa.me/+201002532021", label: "WhatsApp" },
  { icon: <FaFacebookF />, link: "https://www.facebook.com/profile.php?id=61577937253222", label: "Facebook" },
  { icon: <AiFillTikTok />, link: "https://www.tiktok.com/@devercrowd.com", label: "TikTok" },
  { icon: <AiFillInstagram />, link: "https://www.instagram.com/devercrowd/", label: "Instagram" },
  { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/company/devercrowd/", label: "LinkedIn" },
  { icon: <FaSquareXTwitter />, link: "https://x.com/DeverC96471", label: "Twitter" },
  { icon: <FaGithub />, link: "https://github.com/DeverCrowd", label: "GitHub" },
];