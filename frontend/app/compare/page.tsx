import { HospitalCompare } from "@/components/HospitalCompare";
import { getComparison } from "@/lib/api";

export default async function ComparePage() {
  const hospitals = await getComparison();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Compare hospitals</h1>
      <HospitalCompare hospitals={hospitals} />
    </div>
  );
}
