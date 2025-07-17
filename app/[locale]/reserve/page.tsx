"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import { getAccessToken } from "@/app/utils/cookies";
import { useRouter } from "next/navigation";
import { Room } from "@/app/types/room";
import Image from "next/image";

export default function ReservePage() {
  const t = useTranslations("reserve");
  const locale = useLocale(); // 🌍 aktif dil bilgisi buradan alınıyor
  const { user, loading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [infoOpenId, setInfoOpenId] = useState<number | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:3001/rooms?lang=${locale}`);
        const data = await res.json();
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.error(err);
        setRooms([]);
      }
    };
    fetchRooms();
  }, [locale]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setInfoOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (start) {
      const startDate = new Date(start);
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const hour = String(startDate.getHours()).padStart(2, "0");
      const minute = String(startDate.getMinutes()).padStart(2, "0");
      const localISO = `${year}-${month}-${day}T${hour}:${minute}`;
      setEnd(localISO);
    }
  }, [start]);

  if (loading) return <div>{t("loading")}</div>;
  if (!user) return <div>{t("mustLogin")}</div>;

  const toISOStringWithSeconds = (dtLocal: string) => {
    return new Date(dtLocal).toISOString();
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !start || !end) {
      toast.error(t("toast.fillAll"));
      return;
    }

    const token = getAccessToken();
    if (!token) {
      toast.error(t("toast.notLoggedIn"));
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3001/reservations/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            room_id: selectedRoom,
            start_datetime: toISOStringWithSeconds(start),
            end_datetime: toISOStringWithSeconds(end),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || t("toast.error"));
        return;
      }

      toast.success(t("toast.success"));
      setSelectedRoom(null);
      setStart("");
      setEnd("");
    } catch {
      toast.error(t("toast.serverError"));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <div className="p-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
          style={{ cursor: "pointer" }}>
          <Image src="/images/arrowleft.png" alt="" width={15} height={5} />
        </button>
        <h1 className="text-xl font-semibold mb-4 text-cyan-800">
          {t("title")}
        </h1>

        {rooms.length === 0 ? (
          <p className="text-sm text-gray-500">{t("noRooms")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`bg-neutral-50/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:bg-sky-50 -translate-y-2 ${
                  selectedRoom === room.id ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedRoom(room.id)}>
                <p className="font-medium text-cyan-800">{room.name}</p>
                <p className="text-xs text-gray-500">
                  {room.description || room.status}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInfoOpenId(infoOpenId === room.id ? null : room.id);
                  }}
                  className="mt-2 text-sm text-cyan-800 underline hover:text-cyan-950">
                  {t("roomInfo")}
                </button>

                {infoOpenId === room.id && (
                  <div
                    ref={infoRef}
                    className="absolute top-14 left-0 z-10 w-64 bg-white border border-gray-300 shadow-lg rounded-lg p-3 text-sm">
                    <p className="font-semibold mb-1">{room.name}</p>
                    <p>{room.description || t("noDescription")}</p>
                    <p className="text-gray-500 mt-1">
                      {t("status")}: {room.status}
                    </p>
                  </div>
                )}

                {selectedRoom === room.id && (
                  <p className="text-xs text-cyan-900 mt-2">{t("selected")}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 mb-4">
          <label>
            {t("start")}:
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="block w-full border p-2 rounded"
              style={{ cursor: "pointer" }}
            />
          </label>

          <label>
            {t("end")}:
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => {
                if (start && e.target.value.includes("T")) {
                  const [startDate] = start.split("T");
                  const [, timePart] = e.target.value.split("T");
                  const newEnd = `${startDate}T${timePart}`;
                  setEnd(newEnd);
                }
              }}
              min={start ? start.slice(0, 10) + "T00:00" : undefined}
              max={start ? start.slice(0, 10) + "T23:59" : undefined}
              className="block w-full border p-2 rounded"
              style={{ cursor: "pointer" }}
            />
          </label>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleSubmit}
            className="w-md bg-cyan-800 hover:bg-cyan-950 text-white py-2 px-4 rounded-2xl shadow-md transition-all duration-200 font-extralight"
            style={{ cursor: "pointer" }}>
            {t("submit")}
          </button>
        </div>
      </div>
    </main>
  );
}
