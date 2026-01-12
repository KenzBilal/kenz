// ==========================================
// 🚀 SUPABASE CONFIGURATION (10/10)
// ==========================================
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("submitBtn");

  btn.addEventListener("click", async function () {
    // 1. GET VALUES
    const phone = document.getElementById("phone").value.trim();
    const upi = document.getElementById("upi").value.trim();
    const msg = document.getElementById("statusMsg");

    // 2. VALIDATION
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    if (upi.length < 5 || !upi.includes("@")) {
      alert("Please enter a valid UPI ID (e.g., user@oksbi)");
      return;
    }

    // 3. GET REFERRAL CODE FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || "DIRECT_TRAFFIC";

    // 4. SHOW LOADING
    btn.innerText = "Processing...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    try {
      // 5. SQL LOGIC: FIND PROMOTER & CAMPAIGN IDs
      // A. Get Promoter UUID
      const { data: promoter } = await supabase
        .from('promoters')
        .select('id')
        .eq('username', refCode)
        .single();

      // B. Get Motwal Campaign UUID
      const { data: campaign } = await supabase
        .from('campaigns')
        .select('id')
        .eq('app_name', 'Motwal')
        .single();

      // 6. INSERT LEAD INTO SQL
const { error } = await supabase
  .from('leads')
  .insert([{
      promoter_id: promoter ? promoter.id : null, 
      campaign_id: campaign ? campaign.id : null,
      lead_phone: phone,
      lead_upi: upi, // <--- NEW: Saves the user's UPI
      status: 'pending'
  }]);
      if (error) throw error;

      // SUCCESS: SHOW MSG & REDIRECT
      msg.style.display = "block";
      btn.style.display = "none";

      setTimeout(() => {
        window.location.href = "https://trkkcoin.com/IT3779ZXP1/JAM0MN?ln=English";
      }, 1500);

    } catch (err) {
      console.error("SQL Error:", err);
      // Fail-safe: Always redirect so the user completes the task
      window.location.href = "https://trkkcoin.com/IT3779ZXP1/JAM0MN?ln=English";
    }
  });
});
