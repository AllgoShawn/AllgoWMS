using System;
using System.Collections.Generic;
using System.Text;

namespace Aims.MultiTenancy.Payments.Stripe.Dto
{
    public class StripeGetPaymentInput
    {
        public string StripeSessionId { get; set; }
    }
}
