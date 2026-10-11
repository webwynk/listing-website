import { redirect } from "next/navigation";

export default function FindArtistRedirectPage() {
  redirect("/artists");
}
