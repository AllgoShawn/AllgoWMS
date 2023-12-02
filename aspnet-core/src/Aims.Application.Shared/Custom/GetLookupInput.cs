using Abp.Extensions;
using Abp.Runtime.Validation;
using Aims.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Aims.Custom
{
    public class GetLookupInput
    {
        public string source { get; set; }

        public string lookup_type { get; set; }

    }
}
