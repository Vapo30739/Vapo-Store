import React, { useEffect, useState } from "react";

import {
  updateSocialMediaLink,
  updateSettings,
  getSettingsRequest,
} from "../api/axios";

import Whatsapp from "../components/social links/Whatsapp";
import HeroImageField from "../components/HeroImageField";
import HeroBulkImageUploadForm from "../components/HeroBulkImageUploadForm";
import BackButton from "../components/BackButton";
const SettingsPage = () => {
  const token = localStorage.getItem("token");
  const [dollarValue, setDollarValue] = useState("");
  const [settings, setSettings] = useState({});

  const [aboutUs, setAboutUs] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [facebookLink, setFacebookLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [whatsappChannelLink, setWhatsappChannelLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");

  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsData = await getSettingsRequest();

        if (settingsData) {
          setDollarValue(settingsData.dollar_price);
          setAboutUs(settingsData.about_us);
          setFacebookLink(settingsData.social_media.facebook);
          setTelegramLink(settingsData.social_media.telegram);
          setWhatsappChannelLink(settingsData.social_media.whatsapp_channel);
          setInstagramLink(settingsData.social_media.instagram);
          setWhatsappLink(settingsData.social_media.whatsapp);
          setYoutubeLink(settingsData.social_media.youtube);

          setSettings(settingsData);
          sessionStorage.setItem("settings", JSON.stringify(settingsData));
        }
      } catch (err) {
        console.error("Error fetching settings:", err.message);
      }
    };

    fetchData();
  }, [refresh]);

  const ChangeDollarValue = async () => {
    setStatusMessage("");
    setLoading(true);

    try {
      await updateSettings("dollar", dollarValue, token);
      setStatusMessage("Dollar price changed successfully!");
    } catch (error) {
      console.error("Change Failed", error.response?.data);
      setStatusMessage("Failed to change Dollar price");
    } finally {
      setLoading(false);
    }
  };

  const changeAboutUs = async () => {
    setStatusMessage("");
    setLoading(true);

    try {
      await updateSettings("about_us", aboutUs, token);
      setStatusMessage("About Us changed successfully!");
    } catch (error) {
      console.error("Change Failed", error.response?.data);
      setStatusMessage("Failed to change About Us");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLink = (platform, link) => {
    updateSocialMediaLink(platform, link, setLoading, setStatusMessage, token);
  };

  if (!token) return <Unauthorized />;
  return (
    <>
      <div className={"relative min-h-[100vh]"}>
        <div className="relative space-y-4 w-[90vw] mx-auto bg-transparent py-7">
          <BackButton />
          <div>
            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold  w-1/4">
                Dollar Value
              </label>
              <input
                type="number"
                value={dollarValue}
                className="border rounded p-2 w-3/4 bg-red-100 "
                onChange={(e) => setDollarValue(e.target.value)}
              />

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={ChangeDollarValue}
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>

            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold w-1/4">About Us</label>
              <textarea
                className="border rounded p-2 w-3/4 bg-red-100 resize-none overflow-hidden"
                rows={1}
                value={aboutUs}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onChange={(e) => {
                  setAboutUs(e.target.value);
                }}
              ></textarea>

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={changeAboutUs}
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>
            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold  w-1/4">
                Facebook Link
              </label>
              <input
                type="text"
                value={facebookLink}
                className="border rounded p-2 w-3/4 bg-red-100 "
                onChange={(e) => setFacebookLink(e.target.value)}
              />

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={() => handleChangeLink("facebook", facebookLink)}
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>
            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold  w-1/4">
                Telegram Link
              </label>
              <input
                type="text"
                value={telegramLink}
                className="border rounded p-2 w-3/4 bg-red-100 "
                onChange={(e) => setTelegramLink(e.target.value)}
              />

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={() => handleChangeLink("telegram", telegramLink)}
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>
            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold  w-1/4">
                Whatsapp Channel Link
              </label>
              <input
                type="text"
                value={whatsappChannelLink}
                className="border rounded p-2 w-3/4 bg-red-100 "
                onChange={(e) => setWhatsappChannelLink(e.target.value)}
              />

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={() =>
                  handleChangeLink("whatsapp_channel", whatsappChannelLink)
                }
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>
            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold  w-1/4">
                Instagram Link
              </label>
              <input
                type="text"
                value={instagramLink}
                className="border rounded p-2 w-3/4 bg-red-100 "
                onChange={(e) => setInstagramLink(e.target.value)}
              />

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={() => handleChangeLink("instagram", instagramLink)}
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>
            <div className="flex items-center  mb-5 ">
              <label className="text-white font-bold  w-1/4">
                Youtube Link
              </label>
              <input
                type="text"
                value={youtubeLink}
                className="border rounded p-2 w-3/4 bg-red-100 "
                onChange={(e) => setYoutubeLink(e.target.value)}
              />

              <button
                className={`text-white ml-2 p-1 rounded ${
                  loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600"
                }`}
                onClick={() => handleChangeLink("youtube", youtubeLink)}
                disabled={loading}
              >
                {loading ? "loading" : "Save"}
              </button>
            </div>

            <div className="relative w-[80vw] mx-auto py-5 space-y-5">
              <Whatsapp accounts={whatsappLink} />
              {!loading && settings?.hero && (
                <HeroBulkImageUploadForm
                  inputDetails={settings}
                  endpoint={"hero"}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              )}
              {!loading && settings?.hero && (
                <HeroImageField
                  inputDetails={settings}
                  endpoint={"hero"}
                  name={"Hero"}
                />
              )}
            </div>
          </div>
          <p className="text-lg text-red-700 font-bold"> {statusMessage}</p>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
